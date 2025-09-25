import { Column, Entity, Index, OneToMany } from "typeorm";
import { Contrato } from "./Contrato";
import { EvaluacionTrabajador } from "./EvaluacionTrabajador";

@Index("trabajador_codigo_empleado_key", ["codigoEmpleado"], { unique: true })
@Index("trabajador_pkey", ["id"], { unique: true })
@Entity("trabajador", { schema: "people_management" })
export class Trabajador {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("uuid", { name: "usuario_id" })
  usuarioId: string;

  @Column("character varying", {
    name: "codigo_empleado",
    nullable: true,
    unique: true,
    length: 20,
  })
  codigoEmpleado: string | null;

  @Column("character varying", { name: "cargo", length: 100 })
  cargo: string;

  @Column("character varying", {
    name: "departamento",
    nullable: true,
    length: 100,
  })
  departamento: string | null;

  @Column("date", { name: "fecha_ingreso" })
  fechaIngreso: string;

  @Column("date", { name: "fecha_salida", nullable: true })
  fechaSalida: string | null;

  @Column("numeric", {
    name: "salario",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  salario: string | null;

  @Column("boolean", { name: "activo", nullable: true, default: () => "true" })
  activo: boolean | null;

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

  @OneToMany(() => Contrato, (contrato) => contrato.trabajador)
  contratoes: Contrato[];

  @OneToMany(
    () => EvaluacionTrabajador,
    (evaluacionTrabajador) => evaluacionTrabajador.trabajador
  )
  evaluacionTrabajadors: EvaluacionTrabajador[];
}
