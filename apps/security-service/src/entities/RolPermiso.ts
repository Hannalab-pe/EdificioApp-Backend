import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from './Rol';
import { Permiso } from './Permiso';

@Index('rol_permiso_pkey', ['id'], { unique: true })
@Index('uk_rol_permiso', ['rolId', 'permisoId'], { unique: true })
@Entity('rol_permiso', { schema: 'auth_security' })
export class RolPermiso {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column('uuid', { name: 'rol_id' })
  rolId: string;

  @Column('uuid', { name: 'permiso_id' })
  permisoId: string;

  @Column('boolean', {
    name: 'concedido',
    nullable: true,
    default: () => 'true',
  })
  concedido: boolean | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @ManyToOne(() => Rol, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @ManyToOne(() => Permiso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permiso_id' })
  permiso: Permiso;
}
