import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Contrato } from "./Contrato";

@Index("historial_contrato_pkey", ["id"], { unique: true })
@Entity("historial_contrato", { schema: "people_management" })
export class HistorialContrato {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("enum", {
    name: "accion",
    enum: ["CREADO", "MODIFICADO", "RENOVADO", "TERMINADO", "SUSPENDIDO"],
  })
  accion: "CREADO" | "MODIFICADO" | "RENOVADO" | "TERMINADO" | "SUSPENDIDO";

  @Column("date", { name: "fecha_accion" })
  fechaAccion: string;

  @Column("text", { name: "motivo", nullable: true })
  motivo: string | null;

  @Column("jsonb", { name: "detalles", nullable: true })
  detalles: object | null;

  @Column("integer", { name: "usuario_responsable_id", nullable: true })
  usuarioResponsableId: number | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Contrato, (contrato) => contrato.historialContratoes)
  @JoinColumn([{ name: "contrato_id", referencedColumnName: "id" }])
  contrato: Contrato;
}
