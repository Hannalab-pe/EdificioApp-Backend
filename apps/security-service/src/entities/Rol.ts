import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum NivelAcceso {
  ADMIN = 'ADMIN',
  CONDOMINIO = 'CONDOMINIO',
  RESIDENTE = 'RESIDENTE',
  TRABAJADOR = 'TRABAJADOR',
}

@Index('rol_pkey', ['id'], { unique: true })
@Index('rol_nombre_key', ['nombre'], { unique: true })
@Entity('rol', { schema: 'auth_security' })
export class Rol {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column('character varying', { name: 'nombre', length: 50 })
  nombre: string;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @Column('enum', {
    name: 'nivel_acceso',
    enum: NivelAcceso,
  })
  nivelAcceso: NivelAcceso;

  @Column('boolean', { name: 'activo', nullable: true, default: () => 'true' })
  activo: boolean | null;

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
