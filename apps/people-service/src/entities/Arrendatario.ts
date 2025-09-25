import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("arrendatario_pkey", ["id"], { unique: true })
@Entity("arrendatario", { schema: "people_management" })
export class Arrendatario {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "usuario_id" })
  usuarioId: number;

  @Column("character varying", {
    name: "tipo_negocio",
    nullable: true,
    length: 100,
  })
  tipoNegocio: string | null;

  @Column("character varying", { name: "ruc", nullable: true, length: 11 })
  ruc: string | null;

  @Column("date", { name: "fecha_registro" })
  fechaRegistro: string;

  @Column("boolean", { name: "activo", nullable: true, default: () => "true" })
  activo: boolean | null;

  @Column("text", { name: "observaciones", nullable: true })
  observaciones: string | null;

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
}
