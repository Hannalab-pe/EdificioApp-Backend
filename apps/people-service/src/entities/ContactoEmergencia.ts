import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("contacto_emergencia_pkey", ["id"], { unique: true })
@Entity("contacto_emergencia", { schema: "people_management" })
export class ContactoEmergencia {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "usuario_id" })
  usuarioId: number;

  @Column("character varying", { name: "nombre", length: 100 })
  nombre: string;

  @Column("character varying", { name: "relacion", nullable: true, length: 50 })
  relacion: string | null;

  @Column("character varying", { name: "telefono", length: 20 })
  telefono: string;

  @Column("character varying", {
    name: "telefono_alternativo",
    nullable: true,
    length: 20,
  })
  telefonoAlternativo: string | null;

  @Column("character varying", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @Column("text", { name: "direccion", nullable: true })
  direccion: string | null;

  @Column("boolean", {
    name: "es_contacto_principal",
    nullable: true,
    default: () => "false",
  })
  esContactoPrincipal: boolean | null;

  @Column("boolean", { name: "activo", nullable: true, default: () => "true" })
  activo: boolean | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
