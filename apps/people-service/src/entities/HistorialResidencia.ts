import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("historial_residencia_pkey", ["id"], { unique: true })
@Entity("historial_residencia", { schema: "people_management" })
export class HistorialResidencia {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "usuario_id" })
  usuarioId: number;

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
