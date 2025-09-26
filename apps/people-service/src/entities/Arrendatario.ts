import { Column, Entity, Index } from 'typeorm';

@Index('arrendatario_pkey', ['id'], { unique: true })
@Entity('arrendatario', { schema: 'people_management' })
export class Arrendatario {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('uuid', { name: 'usuario_id' })
  usuarioId: string;

  @Column('character varying', {
    name: 'tipo_negocio',
    nullable: true,
    length: 100,
  })
  tipoNegocio: string | null;

  @Column('character varying', { name: 'ruc', nullable: true, length: 11 })
  ruc: string | null;

  @Column('date', { name: 'fecha_registro' })
  fechaRegistro: string;

  @Column('boolean', { name: 'activo', nullable: true, default: () => 'true' })
  activo: boolean | null;

  @Column('text', { name: 'observaciones', nullable: true })
  observaciones: string | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;
}
