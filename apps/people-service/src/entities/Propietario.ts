import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Inmobiliaria } from "./Inmobiliaria";

@Index("propietario_pkey", ["id"], { unique: true })
@Entity("propietario", { schema: "people_management" })
export class Propietario {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "usuario_id" })
  usuarioId: number;

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

  @ManyToOne(() => Inmobiliaria, (inmobiliaria) => inmobiliaria.propietarios)
  @JoinColumn([{ name: "inmobiliaria_id", referencedColumnName: "id" }])
  inmobiliaria: Inmobiliaria;
}
