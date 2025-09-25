import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("residente_pkey", ["id"], { unique: true })
@Entity("residente", { schema: "people_management" })
export class Residente {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "usuario_id" })
  usuarioId: number;

  @Column("enum", {
    name: "tipo_residente",
    enum: ["PROPIETARIO", "FAMILIAR", "INQUILINO", "INVITADO"],
  })
  tipoResidente: "PROPIETARIO" | "FAMILIAR" | "INQUILINO" | "INVITADO";

  @Column("date", { name: "fecha_ingreso" })
  fechaIngreso: string;

  @Column("date", { name: "fecha_salida", nullable: true })
  fechaSalida: string | null;

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
