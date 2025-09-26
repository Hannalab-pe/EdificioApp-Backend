// ============================================================================
// HANDLER PARA EVENTOS DEL SAGA DE TRABAJADORES
// Este archivo maneja los eventos enviados desde Security Service
// ============================================================================

import { Injectable, Logger, Inject } from '@nestjs/common';
import { RabbitSubscribe, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ITrabajadorService } from '../Services/Interfaces';

// =========== DEFINICIÓN DE INTERFACES PARA LOS EVENTOS ===========
// Estructura del mensaje que viene desde Security Service
interface TrabajadorCreationRequestedEvent {
  solicitudId: string;          // ← ID único del saga para tracking
  usuarioId: string;           // ← ID del usuario creado en Security Service
  trabajadorData: {            // ← Datos del trabajador a crear
    cargo: string;
    departamento?: string;
    fechaIngreso: string;
    fechaSalida?: string;
    salario?: string;
    activo?: boolean;
  };
  timeout: number;             // ← Timeout en milisegundos
  timestamp: string;           // ← Timestamp del evento
}

// =========== ESTRUCTURA DE RESPUESTA ===========
// Formato estándar de respuesta que enviamos de vuelta
interface SagaResponse {
  solicitudId: string;
  usuarioId: string;
  status: 'success' | 'failed';
  trabajadorId?: string;       // ← Solo si fue exitoso
  error?: string;              // ← Solo si falló
  timestamp: string;
}

@Injectable()
export class TrabajadorSagaHandler {
  // =========== LOGGER PARA DEBUGGING ===========
  // Logger específico para este handler con nombre identificable
  private readonly logger = new Logger(TrabajadorSagaHandler.name);

  constructor(
    // =========== INYECCIÓN DE DEPENDENCIAS ===========
    // Servicio de trabajadores para crear el registro
    @Inject('ITrabajadorService')
    private readonly trabajadorService: ITrabajadorService,
    // Conexión RabbitMQ para enviar respuestas de vuelta
    private readonly amqpConnection: AmqpConnection,
  ) { }

  // ============================================================================
  // MÉTODO PRINCIPAL: ESCUCHAR EVENTOS DE CREACIÓN DE TRABAJADOR
  // ============================================================================
  @RabbitSubscribe({
    // =========== CONFIGURACIÓN DE SUSCRIPCIÓN ===========
    exchange: 'saga.trabajador',                    // ← Exchange donde escuchar
    routingKey: 'creation.requested',               // ← Tipo específico de evento
    queue: 'trabajador.creation.requests',          // ← Cola donde llegan los mensajes
    // =========== CONFIGURACIONES DE CALIDAD DE SERVICIO ===========
    queueOptions: {
      durable: true,                                // ← Cola sobrevive a reinicios
      arguments: {
        'x-message-ttl': 300000,                    // ← Mensajes expiran en 5 min
      }
    },
    // =========== CONFIGURACIÓN DE CONSUMER ===========
    createQueueIfNotExists: true
  })
  async handleTrabajadorCreationRequest(
    // =========== PARÁMETROS DEL HANDLER ===========
    event: TrabajadorCreationRequestedEvent,       // ← Datos del evento
    amqpMsg: any                                    // ← Mensaje raw de RabbitMQ
  ): Promise<void> {

    // =========== CONFIGURACIÓN DE TIMEOUT ===========
    // Creamos un timeout para evitar procesos colgados
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout después de ${event.timeout}ms`));
      }, event.timeout);
    });

    try {
      // =========== LOGS DE INICIO ===========
      // Log detallado del evento recibido para debugging
      this.logger.log('🚀 Evento recibido: creación de trabajador', {
        solicitudId: event.solicitudId,
        usuarioId: event.usuarioId,
        cargo: event.trabajadorData.cargo,
        timestamp: event.timestamp,
      });

      // =========== VALIDACIÓN DEL EVENTO ===========
      // Verificamos que el evento tenga todos los datos necesarios
      this.validateEvent(event);

      // =========== EJECUTAR CREACIÓN CON TIMEOUT ===========
      // Usamos Promise.race para que gane el que termine primero (creación o timeout)
      const trabajadorResult = await Promise.race([
        this.createTrabajadorSafely(event),        // ← Proceso principal
        timeoutPromise                             // ← Timeout de seguridad
      ]);

      // =========== ACKNOWLEDGE DEL MENSAJE ===========
      // Confirmamos a RabbitMQ que procesamos el mensaje exitosamente
      amqpMsg.ack();

      // =========== NOTIFICAR ÉXITO AL SECURITY SERVICE ===========
      // Enviamos evento de vuelta confirmando que todo salió bien
      await this.publishSuccessEvent({
        solicitudId: event.solicitudId,
        usuarioId: event.usuarioId,
        trabajadorId: trabajadorResult.data.id,
        timestamp: new Date().toISOString(),
      });

      // =========== LOG DE ÉXITO ===========
      this.logger.log('✅ Trabajador creado exitosamente', {
        solicitudId: event.solicitudId,
        trabajadorId: trabajadorResult.data.id,
        usuarioId: event.usuarioId,
      });

    } catch (error) {
      // =========== MANEJO DE ERRORES ===========
      // Log detallado del error para debugging
      this.logger.error('❌ Error al procesar evento de trabajador', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        solicitudId: event.solicitudId,
        usuarioId: event.usuarioId,
      });

      // =========== REJECT DEL MENSAJE ===========
      // Rechazamos el mensaje para que RabbitMQ lo reintente o lo envíe a DLQ
      amqpMsg.nack(false, false); // (allUpTo: false, requeue: false)

      // =========== NOTIFICAR FALLO AL SECURITY SERVICE ===========
      // Enviamos evento de vuelta informando del fallo
      await this.publishFailureEvent({
        solicitudId: event.solicitudId,
        usuarioId: event.usuarioId,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ============================================================================
  // MÉTODO AUXILIAR: VALIDAR EVENTO RECIBIDO
  // ============================================================================
  private validateEvent(event: TrabajadorCreationRequestedEvent): void {
    // =========== VALIDACIONES BÁSICAS ===========
    // Verificamos que los campos obligatorios estén presentes
    if (!event.solicitudId) {
      throw new Error('solicitudId es requerido');
    }
    if (!event.usuarioId) {
      throw new Error('usuarioId es requerido');
    }
    if (!event.trabajadorData) {
      throw new Error('trabajadorData es requerido');
    }
    if (!event.trabajadorData.cargo) {
      throw new Error('trabajadorData.cargo es requerido');
    }
    if (!event.trabajadorData.fechaIngreso) {
      throw new Error('trabajadorData.fechaIngreso es requerido');
    }

    // =========== VALIDACIÓN DE FORMATO DE FECHA ===========
    // Verificamos que la fecha de ingreso sea válida
    const fechaIngreso = new Date(event.trabajadorData.fechaIngreso);
    if (isNaN(fechaIngreso.getTime())) {
      throw new Error('trabajadorData.fechaIngreso debe ser una fecha válida');
    }

    this.logger.debug('✅ Evento validado correctamente', {
      solicitudId: event.solicitudId,
    });
  }

  // ============================================================================
  // MÉTODO AUXILIAR: CREAR TRABAJADOR DE FORMA SEGURA
  // ============================================================================
  private async createTrabajadorSafely(
    event: TrabajadorCreationRequestedEvent
  ): Promise<any> {

    // =========== VERIFICAR TRABAJADOR EXISTENTE ===========
    // Comprobamos si ya existe un trabajador activo para este usuario
    // Esto previene duplicados en caso de reintentos
    const existingTrabajador = await this.checkExistingTrabajador(event.usuarioId);

    if (existingTrabajador) {
      this.logger.warn('⚠️ Ya existe trabajador para este usuario', {
        usuarioId: event.usuarioId,
        existingTrabajadorId: existingTrabajador.id,
      });

      // Retornamos el trabajador existente en lugar de crear uno nuevo
      return {
        success: true,
        data: existingTrabajador,
        message: 'Trabajador ya existía'
      };
    }

    // =========== PREPARAR DATOS DEL TRABAJADOR ===========
    // Convertimos los datos del evento al formato esperado por el servicio
    const trabajadorData = {
      usuarioId: event.usuarioId,                    // ← Relacionar con el usuario
      cargo: event.trabajadorData.cargo,
      departamento: event.trabajadorData.departamento,
      fechaIngreso: event.trabajadorData.fechaIngreso,
      fechaSalida: event.trabajadorData.fechaSalida,
      salario: event.trabajadorData.salario,
      activo: event.trabajadorData.activo ?? true,   // ← Default true
      // =========== METADATOS DEL SAGA ===========
      // Añadimos información para tracking del saga
      sagaId: event.solicitudId,                     // ← Para tracking
      createdBySaga: true,                           // ← Marca que fue creado por saga
    };

    this.logger.debug('📝 Datos preparados para creación', {
      usuarioId: event.usuarioId,
      cargo: trabajadorData.cargo,
      sagaId: event.solicitudId,
    });

    // =========== EJECUTAR CREACIÓN ===========
    // Llamamos al servicio de trabajadores para crear el registro
    const result = await this.trabajadorService.create(trabajadorData);

    if (!result.success) {
      // =========== ERROR EN CREACIÓN ===========
      throw new Error(result.message || 'Error desconocido al crear trabajador');
    }

    this.logger.debug('🎉 Trabajador creado por servicio', {
      trabajadorId: result.data.id,
      usuarioId: event.usuarioId,
    });

    return result;
  }

  // ============================================================================
  // MÉTODO AUXILIAR: VERIFICAR TRABAJADOR EXISTENTE
  // ============================================================================
  private async checkExistingTrabajador(usuarioId: string): Promise<any | null> {
    try {
      // =========== BUSCAR TRABAJADOR ACTIVO ===========
      // Intentamos encontrar un trabajador activo para este usuario
      // Por ahora, asumimos que no existe para evitar errores de compilación
      // TODO: Implementar findByUsuarioId en ITrabajadorService

      this.logger.debug('📝 findByUsuarioId no implementado aún, asumiendo no existe trabajador');
      return null;
    } catch (error) {
      // =========== SI NO EXISTE EL MÉTODO findByUsuarioId ===========
      // Log que indica que necesitamos implementar este método
      this.logger.debug('📝 findByUsuarioId no implementado, asumiendo no existe trabajador');
      return null;
    }
  }

  // ============================================================================
  // MÉTODO AUXILIAR: PUBLICAR EVENTO DE ÉXITO
  // ============================================================================
  private async publishSuccessEvent(data: {
    solicitudId: string;
    usuarioId: string;
    trabajadorId: string;
    timestamp: string;
  }): Promise<void> {

    try {
      // =========== CONSTRUIR PAYLOAD DE RESPUESTA ===========
      const successPayload: SagaResponse = {
        solicitudId: data.solicitudId,
        usuarioId: data.usuarioId,
        status: 'success',
        trabajadorId: data.trabajadorId,
        timestamp: data.timestamp,
      };

      // =========== PUBLICAR EVENTO DE ÉXITO ===========
      // Enviamos de vuelta al Security Service que todo salió bien
      await this.amqpConnection.publish(
        'saga.trabajador',              // ← Exchange
        'creation.completed',           // ← Routing key para éxito
        successPayload,                 // ← Datos de respuesta
        {
          // =========== CONFIGURACIONES DEL MENSAJE ===========
          persistent: true,             // ← Sobrevive a reinicios
          mandatory: true,              // ← Falla si no hay cola
          headers: {
            'saga-id': data.solicitudId, // ← Para tracking
            'event-type': 'success',     // ← Tipo de evento
            'source': 'people-service',  // ← Origen del evento
          },
        }
      );

      this.logger.log('📤 Evento de éxito publicado', {
        solicitudId: data.solicitudId,
        trabajadorId: data.trabajadorId,
      });

    } catch (error) {
      // =========== ERROR AL PUBLICAR ===========
      this.logger.error('❌ Error al publicar evento de éxito', {
        error: error instanceof Error ? error.message : String(error),
        solicitudId: data.solicitudId,
      });
      // No re-lanzamos el error porque el trabajador ya se creó
    }
  }

  // ============================================================================
  // MÉTODO AUXILIAR: PUBLICAR EVENTO DE FALLO
  // ============================================================================
  private async publishFailureEvent(data: {
    solicitudId: string;
    usuarioId: string;
    error: string;
    timestamp: string;
  }): Promise<void> {

    try {
      // =========== CONSTRUIR PAYLOAD DE ERROR ===========
      const failurePayload: SagaResponse = {
        solicitudId: data.solicitudId,
        usuarioId: data.usuarioId,
        status: 'failed',
        error: data.error,
        timestamp: data.timestamp,
      };

      // =========== PUBLICAR EVENTO DE FALLO ===========
      // Enviamos de vuelta al Security Service que algo falló
      await this.amqpConnection.publish(
        'saga.trabajador',              // ← Exchange
        'creation.failed',              // ← Routing key para fallo
        failurePayload,                 // ← Datos de error
        {
          // =========== CONFIGURACIONES DEL MENSAJE ===========
          persistent: true,             // ← Sobrevive a reinicios
          mandatory: true,              // ← Falla si no hay cola
          headers: {
            'saga-id': data.solicitudId, // ← Para tracking
            'event-type': 'failure',     // ← Tipo de evento
            'source': 'people-service',  // ← Origen del evento
          },
        }
      );

      this.logger.log('📤 Evento de fallo publicado', {
        solicitudId: data.solicitudId,
        error: data.error,
      });

    } catch (error) {
      // =========== ERROR AL PUBLICAR ===========
      this.logger.error('❌ Error crítico: no se pudo publicar evento de fallo', {
        error: error instanceof Error ? error.message : String(error),
        originalError: data.error,
        solicitudId: data.solicitudId,
      });
      // Esto es crítico porque Security Service no sabrá que falló
    }
  }
}