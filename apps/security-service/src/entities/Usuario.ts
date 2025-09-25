import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DocumentoIdentidad } from "./DocumentoIdentidad";
import { Rol } from "./Rol";

@Index("usuario_pkey", ["id"], { unique: true })
@Index("usuario_email_key", ["email"], { unique: true })
@Entity("usuario", { schema: "auth_security" })
export class Usuario {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("uuid", { name: "documento_identidad_id" })
  documentoIdentidadId: string;

  @Column("character varying", { name: "email", length: 100 })
  email: string;

  @Column("character varying", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("character varying", { name: "nombre", length: 100 })
  nombre: string;

  @Column("character varying", { name: "apellidos", length: 100 })
  apellidos: string;

  @Column("character varying", { name: "telefono", nullable: true, length: 20 })
  telefono: string | null;

  @Column("integer", { name: "rol_id" })
  rolId: number;

  @Column("boolean", { name: "activo", nullable: true, default: () => "true" })
  activo: boolean | null;

  @Column("timestamp with time zone", { name: "ultimo_acceso", nullable: true })
  ultimoAcceso: Date | null;

  @Column("integer", { name: "intentos_fallidos", nullable: true, default: () => "0" })
  intentosFallidos: number | null;

  @Column("timestamp with time zone", { name: "bloqueado_hasta", nullable: true })
  bloqueadoHasta: Date | null;

  @Column("boolean", { name: "debe_cambiar_password", nullable: true, default: () => "false" })
  debeCambiarPassword: boolean | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(() => DocumentoIdentidad)
  @JoinColumn({ name: "documento_identidad_id" })
  documentoIdentidad: DocumentoIdentidad;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: "rol_id" })
  rol: Rol;
}