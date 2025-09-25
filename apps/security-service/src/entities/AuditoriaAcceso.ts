import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Index("auditoria_accesos_pkey", ["id"], { unique: true })
@Index("idx_auditoria_accion", ["accion"])
@Index("idx_auditoria_usuario_timestamp", ["usuarioId", "timestamp"])
@Entity("auditoria_accesos", { schema: "auth_security" })
export class AuditoriaAcceso {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "usuario_id", nullable: true })
  usuarioId: number | null;

  @Column("character varying", { name: "accion", length: 100 })
  accion: string;

  @Column("character varying", { name: "recurso", nullable: true, length: 100 })
  recurso: string | null;

  @Column("jsonb", { name: "detalles", nullable: true })
  detalles: object | null;

  @Column("inet", { name: "ip_address", nullable: true })
  ipAddress: string | null;

  @Column("text", { name: "user_agent", nullable: true })
  userAgent: string | null;

  @Column("boolean", { name: "exitoso" })
  exitoso: boolean;

  @Column("timestamp with time zone", {
    name: "timestamp",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  timestamp: Date | null;

  @ManyToOne(() => Usuario, { onDelete: "SET NULL" })
  @JoinColumn({ name: "usuario_id" })
  usuario: Usuario;
}