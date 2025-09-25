import { Column, Entity, Index } from "typeorm";

@Index("perfil_persona_pkey", ["id"], { unique: true })
@Entity("perfil_persona", { schema: "people_management" })
export class PerfilPersona {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("uuid", { name: "usuario_id" })
  usuarioId: string;

  @Column("character varying", {
    name: "foto_url",
    nullable: true,
    length: 500,
  })
  fotoUrl: string | null;

  @Column("date", { name: "fecha_nacimiento", nullable: true })
  fechaNacimiento: string | null;

  @Column("enum", {
    name: "estado_civil",
    nullable: true,
    enum: ["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO", "CONVIVIENTE"],
  })
  estadoCivil:
    | "SOLTERO"
    | "CASADO"
    | "DIVORCIADO"
    | "VIUDO"
    | "CONVIVIENTE"
    | null;

  @Column("character varying", {
    name: "profesion",
    nullable: true,
    length: 100,
  })
  profesion: string | null;

  @Column("character varying", {
    name: "empresa_trabajo",
    nullable: true,
    length: 150,
  })
  empresaTrabajo: string | null;

  @Column("character varying", {
    name: "telefono_trabajo",
    nullable: true,
    length: 20,
  })
  telefonoTrabajo: string | null;

  @Column("character varying", {
    name: "contacto_emergencia_nombre",
    nullable: true,
    length: 100,
  })
  contactoEmergenciaNombre: string | null;

  @Column("character varying", {
    name: "contacto_emergencia_telefono",
    nullable: true,
    length: 20,
  })
  contactoEmergenciaTelefono: string | null;

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
