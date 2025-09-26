// ============================================================================
// HANDLERS DE RESPUESTA PARA EL SAGA DE TRABAJADORES
// Estos handlers procesan las respuestas del People Service
// ============================================================================

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { RabbitSubscribe, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Usuario } from '../entities/Usuario';
import { SolicitudTrabajador } from '../entities/SolicitudTrabajador';

// =========== INTERFACES PARA LOS EVENTOS DE RESPUESTA ===========
// Estructura del mensaje de éxito que viene del People Service
interface TrabajadorCreationCompletedEvent {
  solicitudId: string;         // ← ID del saga para identificar la solicitud
  usuarioId: string;          // ← ID del usuario
  status: 'success';          // ← Estado del proceso
  trabajadorId: string;       // ← ID del trabajador creado
  timestamp: string;          // ← Timestamp del evento
}

// Estructura del mensaje de fallo que viene del People Service
interface TrabajadorCreationFailedEvent {
  solicitudId: string;         // ← ID del saga para identificar la solicitud
  usuarioId: string;          // ← ID del usuario
  status: 'failed';           // ← Estado del proceso
  error: string;              // ← Mensaje de error
  timestamp: string;          // ← Timestamp del evento
}

// ============================================================================
// HANDLER PARA EVENTOS DE ÉXITO
// ============================================================================
@Injectable()
export class TrabajadorCreationCompletedHandler {
  // =========== LOGGER ESPECÍFICO ===========
  // Logger con nombre identificable para debugging
  private readonly logger = new Logger(TrabajadorCreationCompletedHandler.name);

  constructor(
    // =========== REPOSITORIOS PARA ACTUALIZAR DATOS ===========
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(SolicitudTrabajador)
    private readonly solicitudRepository: Repository<SolicitudTrabajador>,
  ) {}

  // =========== ESCUCHAR EVENTOS DE ÉXITO ===========
  @RabbitSubscribe({
    exchange: 'saga.trabajador',           // ← Exchange donde escuchar
    routingKey: 'creation.completed',      // ← Eventos de éxito
    queue: 'trabajador.creation.responses.success', // ← Cola específica para éxitos
    queueOptions: {
      durable: true,                       // ← Cola sobrevive a reinicios
      arguments: {
        'x-message-ttl': 300000,           // ← Mensajes expiran en 5 min
      }
    }
  })
  async handleTrabajadorCreationCompleted(
    event: TrabajadorCreationCompletedEvent,
    amqpMsg: any
  ): Promise<void> {

    try {
      // =========== LOGS DE INICIO ===========
      // Log detallado para tracking del saga
      this.logger.log('🎉 Procesando finalización exitosa de trabajador', {
        solicitudId: event.solicitudId,
        usuarioId: event.usuarioId,
        trabajadorId: event.trabajadorId,
        timestamp: event.timestamp,
      });

      // =========== ACTUALIZAR ESTADO DEL USUARIO ===========
      // Cambiamos el estado de 'pending' a 'created'
      const updateUserResult = await this.usuarioRepository.update(
        { id: event.usuarioId },
        {
          estadoTrabajador: 'created',       // ← Estado final exitoso
          trabajadorId: event.trabajadorId, // ← Referencia al trabajador creado
          updatedAt: new Date(),             // ← Timestamp de actualización
        }
      );

      // =========== VERIFICAR QUE LA ACTUALIZACIÓN FUNCIONÓ ===========
      if (updateUserResult.affected === 0) {
        this.logger.warn('⚠️ No se encontró usuario para actualizar', {
          usuarioId: event.usuarioId,
          solicitudId: event.solicitudId,
        });
      }

      // =========== ACTUALIZAR SOLICITUD DE TRABAJADOR ===========
      // Marcamos la solicitud como completada con todos los detalles
      const updateSolicitudResult = await this.solicitudRepository.update(
        { id: event.solicitudId },
        {
          estado: 'completed',               // ← Estado final de la solicitud
          trabajadorId: event.trabajadorId, // ← Referencia al trabajador
          completedAt: new Date(),          // ← Timestamp de completación
          updatedAt: new Date(),            // ← Timestamp de actualización
        }
      );

      // =========== VERIFICAR QUE LA ACTUALIZACIÓN FUNCIONÓ ===========
      if (updateSolicitudResult.affected === 0) {
        this.logger.warn('⚠️ No se encontró solicitud para actualizar', {
          solicitudId: event.solicitudId,
          usuarioId: event.usuarioId,
        });
      }

      // =========== ACKNOWLEDGE DEL MENSAJE ===========
      // Confirmamos a RabbitMQ que procesamos el mensaje
      amqpMsg.ack();

      // =========== LOG DE ÉXITO COMPLETO ===========
      this.logger.log('✅ Saga completado exitosamente', {
        solicitudId: event.solicitudId,
        usuarioId: event.usuarioId,
        trabajadorId: event.trabajadorId,
        userUpdated: updateUserResult.affected ? updateUserResult.affected > 0 : false,
        solicitudUpdated: updateSolicitudResult.affected ? updateSolicitudResult.affected > 0 : false,
      });

      // =========== OPCIONAL: NOTIFICAR AL USUARIO ===========
      // Aquí puedes añadir notificaciones (email, WebSocket, etc.)
      await this.notifyUserSuccess(event.usuarioId, event.trabajadorId);

    } catch (error) {
      // =========== MANEJO DE ERRORES EN PROCESAMIENTO ===========
      this.logger.error('❌ Error al procesar finalización exitosa', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        event,
      });

      // =========== NACK - REINTENTA O ENVÍA A DLQ ===========
      amqpMsg.nack(false, false); // No requeue, envía a dead letter
    }
  }

  // =========== MÉTODO AUXILIAR: NOTIFICAR ÉXITO AL USUARIO ===========
  private async notifyUserSuccess(usuarioId: string, trabajadorId: string): Promise<void> {
    try {
      // =========== AQUÍ IMPLEMENTARÍAS NOTIFICACIONES ===========
      // Ejemplos de notificaciones que podrías implementar:

      // 1. Email de confirmación:
      // await this.emailService.send(usuarioId, 'TRABAJADOR_CREATED', { trabajadorId });

      // 2. Notificación WebSocket en tiempo real:
      // await this.websocketGateway.emit(usuarioId, 'trabajador:created', { trabajadorId });

      // 3. Notificación push:
      // await this.pushNotificationService.send(usuarioId, 'Tu trabajador ha sido creado');

      this.logger.debug('📧 Notificación de éxito procesada', {
        usuarioId,
        trabajadorId,
      });

    } catch (error) {
      // =========== ERROR EN NOTIFICACIÓN NO ES CRÍTICO ===========
      // La notificación falla pero el proceso principal sigue
      this.logger.warn('⚠️ Error al enviar notificación de éxito (no crítico)', {
        error: error instanceof Error ? error.message : String(error),
        usuarioId,
        trabajadorId,
      });
    }
  }
}

// ============================================================================
// HANDLER PARA EVENTOS DE FALLO - COMPENSACIÓN
// ============================================================================
@Injectable()
export class TrabajadorCreationFailedHandler {
  // =========== LOGGER ESPECÍFICO ===========
  private readonly logger = new Logger(TrabajadorCreationFailedHandler.name);

  constructor(
    // =========== REPOSITORIOS Y DATASOURCE ===========
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(SolicitudTrabajador)
    private readonly solicitudRepository: Repository<SolicitudTrabajador>,
    private readonly dataSource: DataSource, // ← Para transacciones
    private readonly amqpConnection: AmqpConnection, // ← Para republicar eventos
  ) {}

  // =========== ESCUCHAR EVENTOS DE FALLO ===========
  @RabbitSubscribe({
    exchange: 'saga.trabajador',           // ← Exchange donde escuchar
    routingKey: 'creation.failed',         // ← Eventos de fallo
    queue: 'trabajador.creation.responses.failed', // ← Cola específica para fallos
    queueOptions: {
      durable: true,                       // ← Cola sobrevive a reinicios
      arguments: {
        'x-message-ttl': 300000,           // ← Mensajes expiran en 5 min
      }
    }
  })
  async handleTrabajadorCreationFailed(
    event: TrabajadorCreationFailedEvent,
    amqpMsg: any
  ): Promise<void> {

    // =========== TRANSACCIÓN PARA COMPENSACIÓN ===========
    // Usamos transacción para garantizar consistencia en la compensación
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // =========== LOGS DE COMPENSACIÓN ===========
      this.logger.warn('⚠️ Iniciando compensación por fallo en trabajador', {
        solicitudId: event.solicitudId,
        usuarioId: event.usuarioId,
        error: event.error,
        timestamp: event.timestamp,
      });

      // =========== BUSCAR LA SOLICITUD PARA ANÁLISIS ===========
      const solicitud = await queryRunner.manager.findOne(SolicitudTrabajador, {
        where: { id: event.solicitudId },
      });

      if (!solicitud) {
        throw new Error(`Solicitud ${event.solicitudId} no encontrada para compensación`);
      }

      // =========== DECIDIR ESTRATEGIA DE COMPENSACIÓN ===========
      // Analizamos si podemos reintentar o debemos hacer rollback completo
      const shouldRetry = this.shouldRetryBasedOnError(event.error, solicitud.intentos);

      if (shouldRetry) {
        // =========== ESTRATEGIA: REINTENTO ===========
        await this.scheduleRetry(solicitud, event.error, queryRunner);

        this.logger.log('🔄 Reintento programado', {
          solicitudId: event.solicitudId,
          intento: solicitud.intentos + 1,
        });

      } else {
        // =========== ESTRATEGIA: COMPENSACIÓN COMPLETA ===========
        await this.performFullCompensation(event, queryRunner);

        this.logger.log('🔄 Compensación completa realizada', {
          solicitudId: event.solicitudId,
          usuarioId: event.usuarioId,
        });
      }

      // =========== COMMIT DE LA COMPENSACIÓN ===========
      await queryRunner.commitTransaction();

      // =========== ACKNOWLEDGE DEL MENSAJE ===========
      amqpMsg.ack();

    } catch (compensationError) {
      // =========== ERROR EN COMPENSACIÓN ===========
      await queryRunner.rollbackTransaction();

      this.logger.error('❌ Error crítico en compensación', {
        compensationError: compensationError instanceof Error ?
          compensationError.message : String(compensationError),
        originalEvent: event,
      });

      // =========== MARCAR PARA REVISIÓN MANUAL ===========
      await this.markForManualReview(event.solicitudId, compensationError);

      // =========== NACK DEL MENSAJE ===========
      amqpMsg.nack(false, false); // No requeue, critical error

    } finally {
      // =========== LIMPIEZA ===========
      await queryRunner.release();
    }
  }

  // =========== DECIDIR SI REINTENTAR BASADO EN EL ERROR ===========
  private shouldRetryBasedOnError(error: string, currentAttempts: number): boolean {
    // =========== MÁXIMO 3 INTENTOS ===========
    if (currentAttempts >= 3) {
      return false;
    }

    // =========== ERRORES QUE SÍ SE PUEDEN REINTENTAR ===========
    const retryableErrors = [
      'timeout',                    // ← Timeouts pueden ser temporales
      'connection refused',         // ← Problemas de red temporales
      'service unavailable',        // ← People Service temporalmente caído
      'network error',              // ← Errores de red
      'database connection',        // ← Problemas de DB temporales
    ];

    // =========== ERRORES QUE NO SE DEBEN REINTENTAR ===========
    const nonRetryableErrors = [
      'validation error',           // ← Datos incorrectos
      'duplicate key',              // ← Ya existe el trabajador
      'foreign key constraint',     // ← Problema de integridad
      'invalid data',               // ← Datos mal formateados
    ];

    const errorLower = error.toLowerCase();

    // =========== VERIFICAR SI ES NO-REINTENABLE ===========
    if (nonRetryableErrors.some(nonRetryable =>
      errorLower.includes(nonRetryable))) {
      return false;
    }

    // =========== VERIFICAR SI ES REINTENABLE ===========
    return retryableErrors.some(retryable =>
      errorLower.includes(retryable));
  }

  // =========== PROGRAMAR REINTENTO ===========
  private async scheduleRetry(
    solicitud: SolicitudTrabajador,
    error: string,
    queryRunner: any
  ): Promise<void> {

    // =========== INCREMENTAR CONTADOR DE INTENTOS ===========
    solicitud.intentos += 1;
    solicitud.estado = 'retry_scheduled';
    solicitud.errorMessage = error;
    solicitud.updatedAt = new Date();

    // =========== CALCULAR DELAY EXPONENCIAL ===========
    // Delay creciente: 2^intentos * 1000ms (1s, 2s, 4s, 8s...)
    const retryDelay = Math.pow(2, solicitud.intentos) * 1000;
    solicitud.nextRetryAt = new Date(Date.now() + retryDelay);

    // =========== GUARDAR CAMBIOS ===========
    await queryRunner.manager.save(solicitud);

    // =========== PROGRAMAR EL REINTENTO ===========
    // En un entorno de producción usarías un job scheduler como Bull/Agenda
    setTimeout(async () => {
      await this.executeRetry(solicitud.id);
    }, retryDelay);

    this.logger.log('⏰ Reintento programado', {
      solicitudId: solicitud.id,
      intento: solicitud.intentos,
      nextRetryAt: solicitud.nextRetryAt,
      delayMs: retryDelay,
    });
  }

  // =========== COMPENSACIÓN COMPLETA ===========
  private async performFullCompensation(
    event: TrabajadorCreationFailedEvent,
    queryRunner: any
  ): Promise<void> {

    // =========== OPCIÓN 1: MANTENER USUARIO MARCADO COMO FALLIDO ===========
    // Actualizamos el usuario para indicar que el proceso falló
    await queryRunner.manager.update(Usuario,
      { id: event.usuarioId },
      {
        estadoTrabajador: 'failed',          // ← Estado de fallo
        updatedAt: new Date(),
      }
    );

    // =========== OPCIÓN 2: ELIMINAR USUARIO COMPLETAMENTE (ROLLBACK TOTAL) ===========
    // Si prefieres rollback completo, descomenta esto:
    /*
    await queryRunner.manager.delete(Usuario, { id: event.usuarioId });
    this.logger.log('🗑️ Usuario eliminado como parte de la compensación', {
      usuarioId: event.usuarioId,
    });
    */

    // =========== ACTUALIZAR SOLICITUD ===========
    await queryRunner.manager.update(SolicitudTrabajador,
      { id: event.solicitudId },
      {
        estado: 'compensation_completed',     // ← Estado de compensación
        errorMessage: event.error,           // ← Error original
        compensatedAt: new Date(),           // ← Timestamp de compensación
        updatedAt: new Date(),
      }
    );

    // =========== NOTIFICAR AL USUARIO DEL FALLO ===========
    await this.notifyUserFailure(event.usuarioId, event.error);

    this.logger.log('🔄 Compensación completa finalizada', {
      solicitudId: event.solicitudId,
      usuarioId: event.usuarioId,
      error: event.error,
    });
  }

  // =========== EJECUTAR REINTENTO ===========
  private async executeRetry(solicitudId: string): Promise<void> {

    try {
      // =========== BUSCAR SOLICITUD PARA REINTENTO ===========
      const solicitud = await this.solicitudRepository.findOne({
        where: { id: solicitudId },
      });

      if (!solicitud || solicitud.estado !== 'retry_scheduled') {
        this.logger.debug('⏭️ Solicitud ya procesada o cancelada', {
          solicitudId,
          estado: solicitud?.estado,
        });
        return; // Ya fue procesada o cancelada
      }

      // =========== DESERIALIZAR DATOS DEL TRABAJADOR ===========
      const trabajadorData = JSON.parse(solicitud.trabajadorData);

      // =========== REPUBLICAR EVENTO PARA REINTENTO ===========
      await this.amqpConnection.publish(
        'saga.trabajador',              // ← Exchange
        'creation.requested',           // ← Routing key original
        {
          solicitudId: solicitud.id,
          usuarioId: solicitud.usuarioId,
          trabajadorData: trabajadorData,
          timeout: 30000,               // ← 30 segundos timeout
          timestamp: new Date().toISOString(),
          retryAttempt: solicitud.intentos, // ← Indicar que es reintento
        },
        {
          persistent: true,
          headers: {
            'saga-id': solicitud.id,
            'retry-attempt': solicitud.intentos.toString(),
          },
        }
      );

      // =========== ACTUALIZAR ESTADO A 'PROCESSING' ===========
      await this.solicitudRepository.update(
        { id: solicitudId },
        {
          estado: 'processing',
          updatedAt: new Date()
        }
      );

      this.logger.log('🔄 Evento republicado para reintento', {
        solicitudId,
        intento: solicitud.intentos,
      });

    } catch (error) {
      // =========== ERROR EN REINTENTO ===========
      this.logger.error('❌ Error al ejecutar reintento', {
        error: error instanceof Error ? error.message : String(error),
        solicitudId,
      });

      // Marcar la solicitud como fallida permanentemente
      await this.solicitudRepository.update(
        { id: solicitudId },
        {
          estado: 'failed',
          errorMessage: `Error en reintento: ${error}`,
          updatedAt: new Date()
        }
      );
    }
  }

  // =========== MARCAR PARA REVISIÓN MANUAL ===========
  private async markForManualReview(
    solicitudId: string,
    error: any
  ): Promise<void> {

    try {
      await this.solicitudRepository.update(
        { id: solicitudId },
        {
          estado: 'manual_review_required',  // ← Requiere intervención humana
          errorMessage: error instanceof Error ? error.message : String(error),
          updatedAt: new Date(),
        }
      );

      // =========== ALERTA A ADMINISTRADORES ===========
      this.logger.error('🚨 Saga marcado para revisión manual', {
        solicitudId,
        error: error instanceof Error ? error.message : String(error),
      });

      // Aquí puedes implementar alertas adicionales:
      // - Email a administradores
      // - Slack notification
      // - Dashboard alert
      // await this.alertService.sendCriticalAlert('SAGA_MANUAL_REVIEW', { solicitudId, error });

    } catch (updateError) {
      // =========== ERROR CRÍTICO ===========
      this.logger.error('🆘 Error crítico: no se pudo marcar para revisión manual', {
        solicitudId,
        originalError: error,
        updateError: updateError instanceof Error ? updateError.message : String(updateError),
      });
    }
  }

  // =========== NOTIFICAR FALLO AL USUARIO ===========
  private async notifyUserFailure(usuarioId: string, error: string): Promise<void> {
    try {
      // =========== IMPLEMENTAR NOTIFICACIONES DE FALLO ===========
      // Ejemplo de notificaciones que podrías implementar:

      // 1. Email de notificación de fallo:
      // await this.emailService.send(usuarioId, 'TRABAJADOR_CREATION_FAILED', { error });

      // 2. Notificación WebSocket:
      // await this.websocketGateway.emit(usuarioId, 'trabajador:failed', { error });

      this.logger.debug('📧 Notificación de fallo enviada', {
        usuarioId,
        error,
      });

    } catch (notificationError) {
      this.logger.warn('⚠️ Error al enviar notificación de fallo (no crítico)', {
        error: notificationError instanceof Error ? notificationError.message : String(notificationError),
        usuarioId,
        originalError: error,
      });
    }
  }
}