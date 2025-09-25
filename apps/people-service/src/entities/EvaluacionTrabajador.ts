import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Trabajador } from "./Trabajador";

@Index("evaluacion_trabajador_pkey", ["id"], { unique: true })
@Index("uk_trabajador_periodo", ["periodo", "trabajadorId"], { unique: true })
@Entity("evaluacion_trabajador", { schema: "people_management" })
export class EvaluacionTrabajador {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "trabajador_id", unique: true })
  trabajadorId: number;

  @Column("character", { name: "periodo", unique: true, length: 7 })
  periodo: string;

  @Column("smallint", { name: "puntualidad", nullable: true })
  puntualidad: number | null;

  @Column("smallint", { name: "calidad_trabajo", nullable: true })
  calidadTrabajo: number | null;

  @Column("smallint", { name: "actitud", nullable: true })
  actitud: number | null;

  @Column("smallint", { name: "colaboracion", nullable: true })
  colaboracion: number | null;

  @Column("numeric", {
    name: "puntaje_total",
    nullable: true,
    precision: 3,
    scale: 2,
  })
  puntajeTotal: string | null;

  @Column("text", { name: "comentarios", nullable: true })
  comentarios: string | null;

  @Column("integer", { name: "evaluador_id" })
  evaluadorId: number;

  @Column("date", { name: "fecha_evaluacion" })
  fechaEvaluacion: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.evaluacionTrabajadors)
  @JoinColumn([{ name: "trabajador_id", referencedColumnName: "id" }])
  trabajador: Trabajador;
}
