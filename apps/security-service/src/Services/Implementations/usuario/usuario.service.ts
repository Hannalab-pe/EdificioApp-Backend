import { HttpStatus, Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Usuario } from '../../../entities/Usuario';
import { SolicitudTrabajador } from '../../../entities/SolicitudTrabajador';
import { DocumentoIdentidad } from '../../../entities/DocumentoIdentidad';
import {
  BaseResponseDto,
  CreateUsuarioDto,
  CreateUsuarioTrabajadorDto,
  CreateDocumentoIdentidadDto,
  UpdateUsuarioDto,
  UsuarioListResponseDto,
  UsuarioResponseDto,
  UsuarioTrabajadorCompositeDto,
} from '../../../dto';
import { IUsuarioService, UsuarioQuery } from '../../Interfaces/usuario/iusuario.service';
import { IDocumentoIdentidadService } from '../../Interfaces/documento-identidad/idocumento-identidad.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService implements IUsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(SolicitudTrabajador)
    private readonly solicitudRepository: Repository<SolicitudTrabajador>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection,
    @Inject('IDocumentoIdentidadService')
    private readonly documentoIdentidadService: IDocumentoIdentidadService,
  ) { }

  async create(
    data: CreateUsuarioDto,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    try {
      const emailExists = await this.usuarioRepository.findOne({
        where: { email: data.email },
      });

      if (emailExists) {
        return BaseResponseDto.error(
          'El email ya esta registrado',
          HttpStatus.BAD_REQUEST,
        );
      }

      const documentExists = await this.usuarioRepository.findOne({
        where: { documentoIdentidadId: data.documentoIdentidadId },
      });

      if (documentExists) {
        return BaseResponseDto.error(
          'El documento de identidad ya esta asociado a otro usuario',
          HttpStatus.BAD_REQUEST,
        );
      }

      const usuario = this.usuarioRepository.create({
        ...data,
        activo: data.activo ?? true,
        debeCambiarPassword: data.debeCambiarPassword ?? false,
        intentosFallidos: 0,
        // =========== VALORES EXPLÍCITOS PARA USUARIOS INDEPENDIENTES/RESIDENTES ===========
        estadoTrabajador: 'none', // Usuario sin trabajador asociado
        trabajadorId: null, // Sin referencia a trabajador
      });

      const saved = await this.usuarioRepository.save(usuario);
      const fullUsuario = await this.getUsuarioById(saved.id);

      return BaseResponseDto.success<UsuarioResponseDto>(
        this.mapToResponse(fullUsuario!),
        'Usuario creado exitosamente',
        HttpStatus.CREATED,
      );
    } catch (error) {
      this.logger.error('Error al crear usuario', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al crear el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ============================================================================
  // MÉTODO PRINCIPAL CON PATRÓN SAGA Y EVENTOS ASINCRÓNICOS
  // ============================================================================
  async createWithTrabajador(
    data: CreateUsuarioTrabajadorDto,
  ): Promise<BaseResponseDto<UsuarioTrabajadorCompositeDto>> {

    // =========== PASO 1: CREAR QUERY RUNNER PARA TRANSACCIÓN ===========
    // Creamos un query runner que nos permitirá manejar transacciones manualmente
    // Esto es necesario para el patrón Saga donde necesitamos control granular
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // Establecemos conexión a la base de datos
    await queryRunner.startTransaction(); // Iniciamos la transacción local

    try {
      // =========== PASO 2: CREAR O VALIDAR DOCUMENTO DE IDENTIDAD ===========
      // Si no se proporciona documentoIdentidadId, creamos uno nuevo
      let documentoIdentidadId = data.usuario.documentoIdentidadId;

      if (!documentoIdentidadId && data.usuario.tipoDocumento && data.usuario.numeroDocumento) {
        this.logger.log('Creando nuevo documento de identidad', {
          tipo: data.usuario.tipoDocumento,
          numero: data.usuario.numeroDocumento,
        });

        // Crear documento de identidad
        const documentoData: CreateDocumentoIdentidadDto = {
          tipo: data.usuario.tipoDocumento,
          numero: data.usuario.numeroDocumento,
          fechaEmision: data.usuario.fechaEmision,
          fechaVencimiento: data.usuario.fechaVencimiento,
          paisEmision: data.usuario.paisEmisor || 'PE',
          validado: false, // Por defecto no validado
        };


        // =========== VERIFICAR SI EL DOCUMENTO YA EXISTE ===========
        // Primero verificamos si ya existe para evitar duplicados
        try {
          const documentoExistente = await this.documentoIdentidadService.findByTipoAndNumero(
            data.usuario.tipoDocumento!,
            data.usuario.numeroDocumento!
          );

          // Si existe, reutilizamos el ID
          documentoIdentidadId = documentoExistente.id;
          this.logger.log('Documento existente encontrado y reutilizado', {
            documentoId: documentoIdentidadId,
            documento: documentoExistente,
          });

        } catch (findError) {
          // Si no existe (NotFoundException), lo creamos DENTRO de la transacción
          this.logger.log('Documento no existe, creando nuevo dentro de la transacción', {
            tipo: data.usuario.tipoDocumento,
            numero: data.usuario.numeroDocumento,
          });

          try {
            // ========= CREAR DOCUMENTO DENTRO DE LA TRANSACCIÓN =========
            // Esto garantiza que si algo falla después, el documento también se revierte
            const nuevoDocumento = queryRunner.manager.create(DocumentoIdentidad, {
              tipo: documentoData.tipo,
              numero: documentoData.numero,
              paisEmision: documentoData.paisEmision || 'PE',
              fechaEmision: documentoData.fechaEmision ? new Date(documentoData.fechaEmision) : null,
              fechaVencimiento: documentoData.fechaVencimiento ? new Date(documentoData.fechaVencimiento) : null,
              validado: false,
            } as Partial<DocumentoIdentidad>);

            const documentoGuardado = await queryRunner.manager.save(DocumentoIdentidad, nuevoDocumento);
            documentoIdentidadId = documentoGuardado.id;

            this.logger.log('Documento de identidad creado exitosamente en transacción', {
              documentoId: documentoIdentidadId,
            });

          } catch (createError) {
            // Si falla la creación dentro de la transacción
            await queryRunner.rollbackTransaction();
            return BaseResponseDto.error<UsuarioTrabajadorCompositeDto>(
              'Error al crear documento de identidad: ' + createError.message,
              HttpStatus.BAD_REQUEST,
              createError.message,
            );
          }
        }
      }

      if (!documentoIdentidadId) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error<UsuarioTrabajadorCompositeDto>(
          'Se requiere documentoIdentidadId o datos para crear documento de identidad',
          HttpStatus.BAD_REQUEST,
        );
      }

      // =========== PASO 3: VALIDACIONES CON LOCKS PESIMISTAS ===========
      // Realizamos validaciones dentro de la transacción para evitar race conditions
      // Los locks pesimistas bloquean las filas hasta que termine la transacción
      const usuarioDataWithDocument = {
        ...data.usuario,
        documentoIdentidadId,
        passwordHash: await bcrypt.hash(data.usuario.password, 12), // Hash de la contraseña
      };

      await this.validateUniqueConstraintsWithLocks(usuarioDataWithDocument, queryRunner);

      // =========== PASO 4: CREAR USUARIO CON ESTADO TEMPORAL ===========
      // Creamos el usuario con un estado que indica que está pendiente de trabajador
      const usuario = queryRunner.manager.create(Usuario, {
        documentoIdentidadId,
        email: data.usuario.email,
        passwordHash: usuarioDataWithDocument.passwordHash,
        nombre: data.usuario.nombre,
        apellidos: data.usuario.apellidos,
        telefono: data.usuario.telefono,
        rolId: data.usuario.rolId,
        activo: data.usuario.activo ?? true,
        debeCambiarPassword: data.usuario.debeCambiarPassword ?? false,
        intentosFallidos: 0,
        // NUEVO CAMPO: Estado que indica que el trabajador está pendiente
        estadoTrabajador: 'pending', // 'pending' | 'created' | 'failed'
      });

      // Guardamos el usuario en la base de datos local
      const savedUsuario = await queryRunner.manager.save(usuario);

      // =========== PASO 5: CREAR SOLICITUD DE TRABAJADOR ===========
      // Creamos un registro de solicitud para tracking del proceso saga
      const solicitudTrabajador = queryRunner.manager.create(SolicitudTrabajador, {
        id: this.generateUniqueId(), // UUID único para tracking
        usuarioId: savedUsuario.id,
        trabajadorData: JSON.stringify(data.trabajador), // Serializamos los datos
        estado: 'pending', // Estados: 'pending' | 'processing' | 'completed' | 'failed'
        intentos: 0, // Contador de reintentos
        // Timeout para el proceso (30 minutos máximo)
        timeoutAt: new Date(Date.now() + 30 * 60 * 1000),
      });

      // Guardamos la solicitud de trabajador
      const savedSolicitud = await queryRunner.manager.save(solicitudTrabajador);

      // =========== PASO 6: COMMIT DE LA TRANSACCIÓN LOCAL ===========
      // Commiteamos la transacción local - el usuario queda creado con estado 'pending'
      await queryRunner.commitTransaction();

      // =========== PASO 7: DISPARAR EVENTO ASÍNCRONO ===========
      // Enviamos evento a través de RabbitMQ para crear el trabajador en people-service
      // Esto se ejecuta DESPUÉS del commit para garantizar consistencia
      await this.publishTrabajadorCreationEvent({
        solicitudId: savedSolicitud.id,
        usuarioId: savedUsuario.id,
        trabajadorData: data.trabajador,
        timeout: 30000, // 30 segundos timeout para la operación remota
      });

      // =========== PASO 8: RESPUESTA INMEDIATA AL CLIENTE ===========
      // Devolvemos respuesta inmediata con estado 202 (Accepted)
      // El cliente sabe que el proceso está en curso
      const fullUsuario = await this.getUsuarioById(savedUsuario.id);

      return BaseResponseDto.success<UsuarioTrabajadorCompositeDto>(
        new UsuarioTrabajadorCompositeDto({
          usuario: this.mapToResponse(fullUsuario!),
          trabajador: {
            status: 'pending',
            solicitudId: savedSolicitud.id,
            message: 'Trabajador en proceso de creación'
          },
        }),
        'Usuario creado exitosamente, trabajador en proceso',
        HttpStatus.ACCEPTED, // 202 - Request accepted, processing
      );

    } catch (error) {
      // =========== MANEJO DE ERRORES ===========
      // Si algo falla antes del commit, hacemos rollback
      await queryRunner.rollbackTransaction();

      this.logger.error('Error en createWithTrabajador saga', {
        error: error instanceof Error ? error.stack : error,
        userData: { email: data.usuario.email },
      });

      return BaseResponseDto.error<UsuarioTrabajadorCompositeDto>(
        'Error al iniciar el proceso de creación de usuario y trabajador',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error instanceof Error ? error.message : error,
      );
    } finally {
      // =========== LIMPIEZA ===========
      // Siempre liberamos los recursos del query runner
      await queryRunner.release();
    }
  }

  async findAll(
    query: UsuarioQuery = {},
  ): Promise<BaseResponseDto<UsuarioListResponseDto>> {
    try {
      const { page = 1, limit = 10, email, activo, rolId, nombre } = query;

      const qb = this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.documentoIdentidad', 'documentoIdentidad')
        .leftJoinAndSelect('usuario.rol', 'rol');

      if (email) {
        qb.andWhere('usuario.email ILIKE :email', { email: `%${email}%` });
      }

      if (activo !== undefined) {
        qb.andWhere('usuario.activo = :activo', { activo });
      }

      if (rolId) {
        qb.andWhere('usuario.rolId = :rolId', { rolId });
      }

      if (nombre) {
        qb.andWhere(
          '(usuario.nombre ILIKE :nombre OR usuario.apellidos ILIKE :nombre)',
          { nombre: `%${nombre}%` },
        );
      }

      qb.skip((page - 1) * limit).take(limit);
      qb.orderBy('usuario.createdAt', 'DESC');

      const [usuarios, total] = await qb.getManyAndCount();
      const totalPages = Math.ceil(total / limit) || 1;

      const dto = new UsuarioListResponseDto({
        usuarios: usuarios.map((u) => this.mapToResponse(u)),
        total,
        page,
        totalPages,
      });

      return BaseResponseDto.success<UsuarioListResponseDto>(
        dto,
        'Usuarios obtenidos exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al listar usuarios', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al listar usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<UsuarioResponseDto>> {
    try {
      const usuario = await this.getUsuarioById(id);

      if (!usuario) {
        return BaseResponseDto.error('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      return BaseResponseDto.success<UsuarioResponseDto>(
        this.mapToResponse(usuario),
        'Usuario obtenido exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al obtener usuario', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al obtener el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(
    email: string,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { email },
        relations: ['documentoIdentidad', 'rol'],
      });

      if (!usuario) {
        return BaseResponseDto.error('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      return BaseResponseDto.success<UsuarioResponseDto>(
        this.mapToResponse(usuario),
        'Usuario obtenido exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al buscar usuario por email', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al obtener el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    data: UpdateUsuarioDto,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    try {
      const usuario = await this.getUsuarioById(id);

      if (!usuario) {
        return BaseResponseDto.error('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      if (data.email && data.email !== usuario.email) {
        const emailExists = await this.usuarioRepository.findOne({
          where: { email: data.email },
        });

        if (emailExists) {
          return BaseResponseDto.error(
            'El email ya esta registrado',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        data.documentoIdentidadId &&
        data.documentoIdentidadId !== usuario.documentoIdentidadId
      ) {
        const docExists = await this.usuarioRepository.findOne({
          where: { documentoIdentidadId: data.documentoIdentidadId },
        });

        if (docExists) {
          return BaseResponseDto.error(
            'El documento de identidad ya esta asociado a otro usuario',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      Object.assign(usuario, data, { updatedAt: new Date() });
      const saved = await this.usuarioRepository.save(usuario);

      return BaseResponseDto.success<UsuarioResponseDto>(
        this.mapToResponse(saved),
        'Usuario actualizado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al actualizar usuario', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al actualizar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<BaseResponseDto<null>> {
    try {
      const usuario = await this.getUsuarioById(id);

      if (!usuario) {
        return BaseResponseDto.error('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      await this.usuarioRepository.remove(usuario);

      return BaseResponseDto.success<null>(
        null,
        'Usuario eliminado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al eliminar usuario', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al eliminar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async softDelete(id: string): Promise<BaseResponseDto<null>> {
    try {
      const usuario = await this.getUsuarioById(id);

      if (!usuario) {
        return BaseResponseDto.error('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      usuario.activo = false;
      usuario.updatedAt = new Date();
      await this.usuarioRepository.save(usuario);

      return BaseResponseDto.success<null>(
        null,
        'Usuario desactivado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al desactivar usuario', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al desactivar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateLastAccess(
    id: string,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    try {
      const usuario = await this.getUsuarioById(id);

      if (!usuario) {
        return BaseResponseDto.error('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      usuario.ultimoAcceso = new Date();
      usuario.updatedAt = new Date();
      const saved = await this.usuarioRepository.save(usuario);

      return BaseResponseDto.success<UsuarioResponseDto>(
        this.mapToResponse(saved),
        'Ultimo acceso actualizado',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al actualizar ultimo acceso', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al actualizar el ultimo acceso',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async incrementFailedAttempts(
    id: string,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    try {
      const usuario = await this.getUsuarioById(id);

      if (!usuario) {
        return BaseResponseDto.error('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      usuario.intentosFallidos = (usuario.intentosFallidos || 0) + 1;

      if (usuario.intentosFallidos >= 5) {
        usuario.bloqueadoHasta = new Date(Date.now() + 30 * 60 * 1000);
      }

      usuario.updatedAt = new Date();
      const saved = await this.usuarioRepository.save(usuario);

      return BaseResponseDto.success<UsuarioResponseDto>(
        this.mapToResponse(saved),
        'Intentos fallidos actualizados',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al incrementar intentos fallidos', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al actualizar intentos fallidos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetFailedAttempts(
    id: string,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    try {
      const usuario = await this.getUsuarioById(id);

      if (!usuario) {
        return BaseResponseDto.error('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      usuario.intentosFallidos = 0;
      usuario.bloqueadoHasta = null;
      usuario.updatedAt = new Date();

      const saved = await this.usuarioRepository.save(usuario);

      return BaseResponseDto.success<UsuarioResponseDto>(
        this.mapToResponse(saved),
        'Intentos fallidos reiniciados',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al reiniciar intentos fallidos', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al reiniciar intentos fallidos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async blockUser(
    id: string,
    until: Date,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    try {
      const usuario = await this.getUsuarioById(id);

      if (!usuario) {
        return BaseResponseDto.error('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      usuario.bloqueadoHasta = until;
      usuario.updatedAt = new Date();

      const saved = await this.usuarioRepository.save(usuario);

      return BaseResponseDto.success<UsuarioResponseDto>(
        this.mapToResponse(saved),
        'Usuario bloqueado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error al bloquear usuario', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'Error interno al bloquear el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getUsuarioById(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { id },
      relations: ['documentoIdentidad', 'rol'],
    });
  }

  private mapToResponse(usuario: Usuario): UsuarioResponseDto {
    return new UsuarioResponseDto({
      ...usuario,
      documentoIdentidad: usuario.documentoIdentidad
        ? {
          id: usuario.documentoIdentidad.id,
          tipo: usuario.documentoIdentidad.tipo,
          numero: usuario.documentoIdentidad.numero,
        }
        : undefined,
      rol: usuario.rol
        ? {
          id: usuario.rol.id,
          nombre: usuario.rol.nombre,
          nivelAcceso: usuario.rol.nivelAcceso,
        }
        : undefined,
    });
  }

  private async createTrabajadorRemoto(
    payload: Record<string, unknown>,
  ): Promise<BaseResponseDto<Record<string, unknown>>> {
    const baseUrl = this.getPeopleServiceBaseUrl();

    try {
      const response = await fetch(`${baseUrl}/trabajador`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as BaseResponseDto<Record<string, unknown>>;

      if (!response.ok) {
        return BaseResponseDto.error(
          json?.message || 'Error al crear trabajador en people-service',
          response.status,
          json?.error,
        );
      }

      return json;
    } catch (error) {
      this.logger.error('Error al invocar people-service', error instanceof Error ? error.stack : error);
      return BaseResponseDto.error(
        'No fue posible comunicarse con el people-service',
        HttpStatus.BAD_GATEWAY,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private getPeopleServiceBaseUrl(): string {
    const explicitUrl = this.configService.get<string>('PEOPLE_SERVICE_URL');

    if (explicitUrl) {
      return explicitUrl.replace(/\/$/, '');
    }

    const port = this.configService.get<number>('PEOPLE_SERVICE_PORT') ?? 3002;
    return `http://localhost:${port}/api/v1`;
  }

  // ============================================================================
  // MÉTODOS AUXILIARES PARA EL PATRÓN SAGA
  // ============================================================================

  // =========== VALIDACIONES CON LOCKS PESIMISTAS ===========
  private async validateUniqueConstraintsWithLocks(
    data: CreateUsuarioDto,
    queryRunner: QueryRunner
  ): Promise<void> {

    // =========== VALIDACIÓN DE EMAIL CON LOCK ===========
    // SELECT ... FOR UPDATE bloquea la fila hasta el final de la transacción
    // Esto previene que otro proceso cree un usuario con el mismo email concurrentemente
    const emailCheck = await queryRunner.manager
      .createQueryBuilder(Usuario, 'u')
      .where('u.email = :email', { email: data.email })
      .setLock('pessimistic_write') // Lock pesimista de escritura
      .getOne();

    if (emailCheck) {
      throw new Error('El email ya está registrado');
    }

    // =========== VALIDACIÓN DE DOCUMENTO CON LOCK ===========
    // Mismo patrón para el documento de identidad
    const docCheck = await queryRunner.manager
      .createQueryBuilder(Usuario, 'u')
      .where('u.documentoIdentidadId = :docId', {
        docId: data.documentoIdentidadId
      })
      .setLock('pessimistic_write') // Lock pesimista de escritura
      .getOne();

    if (docCheck) {
      throw new Error('El documento de identidad ya está asociado a otro usuario');
    }
  }

  // =========== PUBLICAR EVENTO ASÍNCRONO ===========
  private async publishTrabajadorCreationEvent(eventData: {
    solicitudId: string;
    usuarioId: string;
    trabajadorData: any;
    timeout: number;
  }): Promise<void> {

    try {
      // =========== CONFIGURACIÓN DEL TIMEOUT ===========
      // Creamos un AbortController para manejar timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort(); // Cancela la operación si excede el timeout
      }, eventData.timeout);

      // =========== PUBLICACIÓN DEL EVENTO ===========
      // Utilizamos RabbitMQ para enviar el evento
      await this.amqpConnection.publish(
        'saga.trabajador', // Exchange
        'creation.requested', // Routing key
        {
          solicitudId: eventData.solicitudId,
          usuarioId: eventData.usuarioId,
          trabajadorData: eventData.trabajadorData,
          timestamp: new Date().toISOString(),
          timeout: eventData.timeout,
        },
        {
          // Configuraciones de RabbitMQ
          persistent: true, // El mensaje sobrevive a reinicios del broker
          mandatory: true,  // Falla si no hay queue para el mensaje
          headers: {
            'content-type': 'application/json',
            'saga-id': eventData.solicitudId, // Para tracking del saga
          },
          // Configuración del timeout a nivel de mensaje
          expiration: eventData.timeout.toString(),
        }
      );

      // Limpiamos el timeout si todo salió bien
      clearTimeout(timeoutId);

      this.logger.log('Evento de creación de trabajador publicado', {
        solicitudId: eventData.solicitudId,
        usuarioId: eventData.usuarioId,
      });

    } catch (error) {
      // =========== MANEJO DE ERRORES EN PUBLICACIÓN ===========
      this.logger.error('Error al publicar evento de trabajador', {
        error: error instanceof Error ? error.stack : error,
        eventData,
      });

      // Marcamos la solicitud como fallida para compensación posterior
      await this.markSolicitudAsFailed(eventData.solicitudId, error);
      throw error;
    }
  }

  // =========== MARCAR SOLICITUD COMO FALLIDA ===========
  private async markSolicitudAsFailed(
    solicitudId: string,
    error: any
  ): Promise<void> {

    try {
      // Actualizamos el estado de la solicitud a 'failed'
      await this.dataSource
        .createQueryBuilder()
        .update(SolicitudTrabajador)
        .set({
          estado: 'failed',
          errorMessage: error instanceof Error ? error.message : String(error),
          updatedAt: new Date(),
        })
        .where('id = :id', { id: solicitudId })
        .execute();

      // También actualizamos el estado del usuario
      await this.dataSource
        .createQueryBuilder()
        .update(Usuario)
        .set({
          estadoTrabajador: 'failed',
          updatedAt: new Date(),
        })
        .where('id = (SELECT usuarioId FROM solicitud_trabajador WHERE id = :solicitudId)',
          { solicitudId })
        .execute();

    } catch (compensationError) {
      this.logger.error('Error en compensación', {
        originalError: error,
        compensationError,
        solicitudId,
      });
    }
  }

  // =========== GENERAR ID ÚNICO ===========
  private generateUniqueId(): string {
    // Generamos un UUID v4 para tracking único de cada saga
    return require('crypto').randomUUID();
  }
}

