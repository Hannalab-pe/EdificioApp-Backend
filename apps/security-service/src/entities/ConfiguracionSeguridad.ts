import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("configuracion_seguridad_pkey", ["id"], { unique: true })
@Index("configuracion_seguridad_clave_key", ["clave"], { unique: true })
@Entity("configuracion_seguridad", { schema: "auth_security" })
export class ConfiguracionSeguridad {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column("character varying", { name: "clave", length: 50 })
  clave: string;

  @Column("text", { name: "valor" })
  valor: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("boolean", { name: "activo", nullable: true, default: () => "true" })
  activo: boolean | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;
}