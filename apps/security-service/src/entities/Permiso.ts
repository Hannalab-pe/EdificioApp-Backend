import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('permisos_pkey', ['id'], { unique: true })
@Index('uk_permiso', ['modulo', 'accion', 'recurso'], { unique: true })
@Entity('permisos', { schema: 'auth_security' })
export class Permiso {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column('character varying', { name: 'modulo', length: 50 })
  modulo: string;

  @Column('character varying', { name: 'accion', length: 50 })
  accion: string;

  @Column('character varying', { name: 'recurso', nullable: true, length: 50 })
  recurso: string | null;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @Column('boolean', { name: 'activo', nullable: true, default: () => 'true' })
  activo: boolean | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;
}
