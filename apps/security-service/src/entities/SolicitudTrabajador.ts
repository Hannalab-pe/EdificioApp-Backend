import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Index("solicitud_trabajador_pkey", ["id"], { unique: true })
@Index("solicitud_trabajador_usuario_id_idx", ["usuarioId"])
@Index("solicitud_trabajador_estado_idx", ["estado"])
@Entity("solicitud_trabajador", { schema: "auth_security" })
export class SolicitudTrabajador {
  // =========== ID ÚNICO PARA TRACKING DEL SAGA ===========
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  // =========== RELACIÓN CON EL USUARIO ===========
  @Column("uuid", { name: "usuario_id" })
  usuarioId: string;

  // =========== DATOS SERIALIZADOS DEL TRABAJADOR ===========
  // Almacenamos los datos como JSON para recrear la solicitud si es necesario
  @Column("text", { name: "trabajador_data" })
  trabajadorData: string;

  // =========== ESTADO DEL SAGA ===========
  @Column({
    type: "enum",
    enum: [
      "pending",                    // Esperando procesamiento
      "processing",                 // En proceso de creación
      "completed",                  // Completado exitosamente
      "failed",                     // Falló permanentemente
      "retry_scheduled",            // Programado para reintento
      "compensation_completed",     // Compensación realizada
      "manual_review_required"      // Requiere revisión manual
    ],
    default: "pending",
    name: "estado"
  })
  estado: string;

  // =========== CONTADOR DE REINTENTOS ===========
  @Column("integer", { name: "intentos", default: 0 })
  intentos: number;

  // =========== REFERENCIA AL TRABAJADOR CREADO ===========
  @Column("uuid", { name: "trabajador_id", nullable: true })
  trabajadorId: string | null;

  // =========== MENSAJE DE ERROR ===========
  @Column("text", { name: "error_message", nullable: true })
  errorMessage: string | null;

  // =========== TIMESTAMPS PARA CONTROL ===========
  @Column("timestamp with time zone", { name: "next_retry_at", nullable: true })
  nextRetryAt: Date | null;

  @Column("timestamp with time zone", { name: "timeout_at", nullable: true })
  timeoutAt: Date | null;

  @Column("timestamp with time zone", { name: "completed_at", nullable: true })
  completedAt: Date | null;

  @Column("timestamp with time zone", { name: "compensated_at", nullable: true })
  compensatedAt: Date | null;

  // =========== TIMESTAMPS AUTOMÁTICOS ===========
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}