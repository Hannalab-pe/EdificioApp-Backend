import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Propietario } from "./Propietario";

@Index("inmobiliaria_pkey", ["id"], { unique: true })
@Index("inmobiliaria_ruc_key", ["ruc"], { unique: true })
@Entity("inmobiliaria", { schema: "people_management" })
export class Inmobiliaria {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "razon_social", length: 200 })
  razonSocial: string;

  @Column("character varying", {
    name: "ruc",
    nullable: true,
    unique: true,
    length: 11,
  })
  ruc: string | null;

  @Column("text", { name: "direccion", nullable: true })
  direccion: string | null;

  @Column("character varying", { name: "telefono", nullable: true, length: 20 })
  telefono: string | null;

  @Column("character varying", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @Column("character varying", {
    name: "representante_legal",
    nullable: true,
    length: 100,
  })
  representanteLegal: string | null;

  @Column("boolean", { name: "activa", nullable: true, default: () => "true" })
  activa: boolean | null;

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

  @OneToMany(() => Propietario, (propietario) => propietario.inmobiliaria)
  propietarios: Propietario[];
}
