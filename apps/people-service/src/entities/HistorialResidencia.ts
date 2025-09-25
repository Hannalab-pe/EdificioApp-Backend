import { Column, Entity, Index } from "typeorm";

@Index("historial_residencia_pkey", ["id"], { unique: true })
@Entity("historial_residencia", { schema: "people_management" })
export class HistorialResidencia {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("uuid", { name: "usuario_id" })
  usuarioId: string;

  @Column("text", { name: "direccion" })
  direccion: string;

  @Column("character varying", { name: "ciudad", nullable: true, length: 100 })
  ciudad: string | null;

  @Column("date", { name: "fecha_inicio", nullable: true })
  fechaInicio: string | null;

  @Column("date", { name: "fecha_fin", nullable: true })
  fechaFin: string | null;

  @Column("character varying", {
    name: "motivo_cambio",
    nullable: true,
    length: 200,
  })
  motivoCambio: string | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
