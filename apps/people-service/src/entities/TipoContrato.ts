import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Contrato } from './Contrato';

@Index('tipo_contrato_pkey', ['id'], { unique: true })
@Index('tipo_contrato_nombre_key', ['nombre'], { unique: true })
@Entity('tipo_contrato', { schema: 'people_management' })
export class TipoContrato {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'nombre', unique: true, length: 100 })
  nombre: string;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @Column('integer', { name: 'duracion_default_meses', nullable: true })
  duracionDefaultMeses: number | null;

  @Column('boolean', {
    name: 'renovable',
    nullable: true,
    default: () => 'true',
  })
  renovable: boolean | null;

  @Column('boolean', { name: 'activo', nullable: true, default: () => 'true' })
  activo: boolean | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @Column("timestamp with time zone", {
    name: "deleted_at",
    nullable: true,
  })
  deletedAt: Date | null;

  @OneToMany(() => Contrato, (contrato) => contrato.tipoContrato)
  contratoes: Contrato[];
}
