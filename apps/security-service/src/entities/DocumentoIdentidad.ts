import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export enum TipoDocumento {
  DNI = "DNI",
  PASAPORTE = "PASAPORTE",
  CARNET_EXTRANJERIA = "CARNET_EXTRANJERIA"
}

@Index("documento_identidad_pkey", ["id"], { unique: true })
@Index("uk_documento", ["tipo", "numero"], { unique: true })
@Entity("documento_identidad", { schema: "auth_security" })
export class DocumentoIdentidad {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column("enum", {
    name: "tipo",
    enum: TipoDocumento,
  })
  tipo: TipoDocumento;

  @Column("character varying", { name: "numero", length: 20 })
  numero: string;

  @Column("character varying", {
    name: "pais_emision",
    nullable: true,
    length: 2,
    default: () => "'PE'",
  })
  paisEmision: string | null;

  @Column("date", { name: "fecha_emision", nullable: true })
  fechaEmision: string | null;

  @Column("date", { name: "fecha_vencimiento", nullable: true })
  fechaVencimiento: string | null;

  @Column("boolean", { name: "validado", nullable: true, default: () => "false" })
  validado: boolean | null;

  @Column("timestamp with time zone", { name: "fecha_validacion", nullable: true })
  fechaValidacion: Date | null;

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