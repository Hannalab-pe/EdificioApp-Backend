import { Injectable, UnauthorizedException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, DocumentoIdentidad, Rol, SesionUsuario, AuditoriaAcceso, TipoDocumento } from '../entities';
import { LoginDto, RegisterDto, AuthResponseDto, UserInfoDto, ChangePasswordDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(DocumentoIdentidad)
        private documentoRepository: Repository<DocumentoIdentidad>,
        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
        @InjectRepository(SesionUsuario)
        private sesionRepository: Repository<SesionUsuario>,
        @InjectRepository(AuditoriaAcceso)
        private auditoriaRepository: Repository<AuditoriaAcceso>,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<Usuario | null> {
        try {
            const usuario = await this.usuarioRepository.findOne({
                where: { email, activo: true },
                relations: ['rol', 'documentoIdentidad'],
            });

            if (!usuario) {
                return null;
            }

            // Verificar si está bloqueado
            if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
                throw new UnauthorizedException('Usuario temporalmente bloqueado');
            }

            const isPasswordValid = await bcrypt.compare(password, usuario.passwordHash);
            if (!isPasswordValid) {
                // Incrementar intentos fallidos
                await this.handleFailedLoginAttempt(usuario);
                return null;
            }

            // Resetear intentos fallidos en login exitoso
            if (usuario.intentosFallidos > 0) {
                await this.usuarioRepository.update(usuario.id, { intentosFallidos: 0 });
            }

            return usuario;
        } catch (error) {
            this.logger.error(`Error validating user ${email}:`, error);
            return null;
        }
    }

    async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        const usuario = await this.validateUser(email, password);
        if (!usuario) {
            await this.auditarAcceso(null, 'LOGIN', 'auth', { email }, ipAddress, userAgent, false, 'Credenciales inválidas');
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Crear token JWT
        const payload = {
            sub: usuario.id,
            email: usuario.email,
            rol: usuario.rol.nombre,
        };

        const accessToken = this.jwtService.sign(payload);

        // Crear sesión
        const tokenHash = await bcrypt.hash(accessToken, 10);
        await this.sesionRepository.save({
            usuarioId: usuario.id,
            tokenHash,
            ipAddress,
            userAgent,
            expiraEn: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        });

        // Auditar acceso exitoso
        await this.auditarAcceso(usuario.id, 'LOGIN', 'auth', { email }, ipAddress, userAgent, true);

        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn: 86400, // 24 horas en segundos
            user: this.mapToUserInfo(usuario),
        };
    }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const {
            email,
            password,
            nombre,
            apellidos,
            telefono,
            tipoDocumento,
            numeroDocumento,
            paisEmision = 'PE',
            fechaEmision,
            fechaVencimiento,
        } = registerDto;

        // Verificar si el email ya existe
        const existingUser = await this.usuarioRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Verificar si el documento ya existe
        const existingDoc = await this.documentoRepository.findOne({
            where: { tipo: tipoDocumento as TipoDocumento, numero: numeroDocumento }
        });
        if (existingDoc) {
            throw new ConflictException('El documento ya está registrado');
        }

        // Obtener rol por defecto (RESIDENTE)
        const rol = await this.rolRepository.findOne({ where: { nombre: 'RESIDENTE' } });
        if (!rol) {
            throw new BadRequestException('Rol por defecto no encontrado');
        }

        // Crear documento de identidad
        const documentoIdentidad = await this.documentoRepository.save({
            tipo: tipoDocumento as TipoDocumento,
            numero: numeroDocumento,
            paisEmision,
            fechaEmision: fechaEmision ? new Date(fechaEmision) : undefined,
            fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        });

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 12);

        // Crear usuario
        const usuario = await this.usuarioRepository.save({
            documentoIdentidadId: documentoIdentidad.id_documento_identidad,
            email,
            passwordHash,
            nombre,
            apellidos,
            telefono,
            rolId: rol.id,
        });

        // Cargar usuario completo para el token
        const usuarioCompleto = await this.usuarioRepository.findOne({
            where: { id: usuario.id },
            relations: ['rol', 'documentoIdentidad'],
        });

        if (!usuarioCompleto) {
            throw new BadRequestException('Error al crear el usuario');
        }

        // Crear token JWT
        const payload = {
            sub: usuarioCompleto.id,
            email: usuarioCompleto.email,
            rol: usuarioCompleto.rol.nombre,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn: 86400,
            user: this.mapToUserInfo(usuarioCompleto),
        };
    }

    async logout(userId: number, token: string): Promise<void> {
        // Invalidar la sesión actual
        const tokenHash = await bcrypt.hash(token, 10);
        await this.sesionRepository.update(
            { usuarioId: userId, tokenHash, activa: true },
            { activa: false }
        );

        await this.auditarAcceso(userId, 'LOGOUT', 'auth', {}, undefined, undefined, true);
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
        const { currentPassword, newPassword } = changePasswordDto;

        const usuario = await this.usuarioRepository.findOne({ where: { id: userId } });
        if (!usuario) {
            throw new BadRequestException('Usuario no encontrado');
        }

        // Verificar contraseña actual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, usuario.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Contraseña actual incorrecta');
        }

        // Hash de nueva contraseña
        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        // Actualizar contraseña
        await this.usuarioRepository.update(userId, {
            passwordHash: newPasswordHash,
            debeCambiarPassword: false,
        });

        await this.auditarAcceso(userId, 'CHANGE_PASSWORD', 'auth', {}, undefined, undefined, true);
    }

    async refreshToken(userId: number): Promise<AuthResponseDto> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id: userId, activo: true },
            relations: ['rol', 'documentoIdentidad'],
        });

        if (!usuario) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const payload = {
            sub: usuario.id,
            email: usuario.email,
            rol: usuario.rol.nombre,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn: 86400,
            user: this.mapToUserInfo(usuario),
        };
    }

    private async handleFailedLoginAttempt(usuario: Usuario): Promise<void> {
        const maxAttempts = 5; // Configurable
        const lockoutMinutes = 30; // Configurable

        usuario.intentosFallidos += 1;

        if (usuario.intentosFallidos >= maxAttempts) {
            usuario.bloqueadoHasta = new Date(Date.now() + lockoutMinutes * 60 * 1000);
        }

        await this.usuarioRepository.save(usuario);
    }

    private async auditarAcceso(
        usuarioId: number | null,
        accion: string,
        recurso: string,
        detalles: any,
        ipAddress?: string,
        userAgent?: string,
        exitoso: boolean = true,
        errorMessage?: string
    ): Promise<void> {
        try {
            await this.auditoriaRepository.save({
                usuarioId: usuarioId || undefined,
                accion,
                recurso,
                detalles,
                ipAddress,
                userAgent,
                exitoso,
                timestamp: new Date(),
            });
        } catch (error) {
            this.logger.error('Error auditing access:', error);
        }
    }

    async getProfile(userId: number): Promise<UserInfoDto> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id: userId, activo: true },
            relations: ['rol', 'documentoIdentidad'],
        });

        if (!usuario) {
            throw new BadRequestException('Usuario no encontrado');
        }

        return this.mapToUserInfo(usuario);
    }

    async getUsers(options: { page: number; limit: number }): Promise<{ users: UserInfoDto[]; total: number; page: number; limit: number }> {
        const { page, limit } = options;
        const skip = (page - 1) * limit;

        const [usuarios, total] = await this.usuarioRepository.findAndCount({
            where: { activo: true },
            relations: ['rol', 'documentoIdentidad'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            users: usuarios.map(user => this.mapToUserInfo(user)),
            total,
            page,
            limit,
        };
    }

    async createUser(createUserDto: any): Promise<UserInfoDto> {
        const {
            email,
            password,
            nombre,
            apellidos,
            telefono,
            rolId,
            tipoDocumento,
            numeroDocumento,
            paisEmision = 'PE',
            fechaEmision,
            fechaVencimiento,
        } = createUserDto;

        // Verificar si el email ya existe
        const existingUser = await this.usuarioRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Verificar si el documento ya existe
        const existingDoc = await this.documentoRepository.findOne({
            where: { tipo: tipoDocumento, numero: numeroDocumento }
        });
        if (existingDoc) {
            throw new ConflictException('El documento ya está registrado');
        }

        // Verificar rol
        const rol = await this.rolRepository.findOne({ where: { id: rolId } });
        if (!rol) {
            throw new BadRequestException('Rol no encontrado');
        }

        // Crear documento de identidad
        const documentoIdentidad = await this.documentoRepository.save({
            tipo: tipoDocumento,
            numero: numeroDocumento,
            paisEmision,
            fechaEmision: fechaEmision ? new Date(fechaEmision) : undefined,
            fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        });

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 12);

        // Crear usuario
        const usuario = await this.usuarioRepository.save({
            documentoIdentidadId: documentoIdentidad.id_documento_identidad,
            email,
            passwordHash,
            nombre,
            apellidos,
            telefono,
            rolId: rol.id,
        });

        // Cargar usuario completo
        const usuarioCompleto = await this.usuarioRepository.findOne({
            where: { id: usuario.id },
            relations: ['rol', 'documentoIdentidad'],
        });

        if (!usuarioCompleto) {
            throw new BadRequestException('Error al crear el usuario');
        }

        return this.mapToUserInfo(usuarioCompleto);
    }

    async getUserById(id: number): Promise<UserInfoDto> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id, activo: true },
            relations: ['rol', 'documentoIdentidad'],
        });

        if (!usuario) {
            throw new BadRequestException('Usuario no encontrado');
        }

        return this.mapToUserInfo(usuario);
    }

    async updateUser(id: number, updateUserDto: any): Promise<UserInfoDto> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id, activo: true },
            relations: ['rol', 'documentoIdentidad'],
        });

        if (!usuario) {
            throw new BadRequestException('Usuario no encontrado');
        }

        const { rolId, ...updateData } = updateUserDto;

        // Verificar rol si se proporciona
        if (rolId) {
            const rol = await this.rolRepository.findOne({ where: { id: rolId } });
            if (!rol) {
                throw new BadRequestException('Rol no encontrado');
            }
            updateData.rolId = rol.id;
        }

        // Actualizar usuario
        await this.usuarioRepository.update(id, updateData);

        // Cargar usuario actualizado
        const usuarioActualizado = await this.usuarioRepository.findOne({
            where: { id },
            relations: ['rol', 'documentoIdentidad'],
        });

        if (!usuarioActualizado) {
            throw new BadRequestException('Error al actualizar el usuario');
        }

        return this.mapToUserInfo(usuarioActualizado);
    }

    async deleteUser(id: number): Promise<void> {
        const usuario = await this.usuarioRepository.findOne({ where: { id, activo: true } });

        if (!usuario) {
            throw new BadRequestException('Usuario no encontrado');
        }

        // Soft delete - marcar como inactivo
        await this.usuarioRepository.update(id, { activo: false });

        await this.auditarAcceso(id, 'DELETE_USER', 'auth', { targetUserId: id }, undefined, undefined, true);
    }

    async getRoles(): Promise<any[]> {
        return this.rolRepository.find({
            where: { activo: true },
            order: { nombre: 'ASC' },
        });
    }

    async getPermissions(): Promise<any[]> {
        const roles = await this.rolRepository.find({
            where: { activo: true },
            relations: ['rolPermisos', 'rolPermisos.permiso'],
        });

        const permissions = new Set();
        roles.forEach(rol => {
            rol.rolPermisos?.forEach(rolPermiso => {
                if (rolPermiso.concedido && rolPermiso.permiso) {
                    const permisoNombre = rolPermiso.permiso.recurso
                        ? `${rolPermiso.permiso.modulo}:${rolPermiso.permiso.accion}:${rolPermiso.permiso.recurso}`
                        : `${rolPermiso.permiso.modulo}:${rolPermiso.permiso.accion}`;

                    permissions.add({
                        id: rolPermiso.permiso.id,
                        nombre: permisoNombre,
                        descripcion: rolPermiso.permiso.descripcion,
                        modulo: rolPermiso.permiso.modulo,
                    });
                }
            });
        });

        return Array.from(permissions);
    }

    private mapToUserInfo(usuario: Usuario): UserInfoDto {
        return {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            rol: {
                id: usuario.rol.id,
                nombre: usuario.rol.nombre,
                nivelAcceso: usuario.rol.nivelAcceso,
            },
            activo: usuario.activo,
        };
    }
}
