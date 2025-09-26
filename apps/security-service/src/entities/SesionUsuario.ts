import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './Usuario';

@Index('sesiones_usuario_pkey', ['id'], { unique: true })
@Index('idx_sesiones_token', ['tokenHash'])
@Index('idx_sesiones_usuario_activa', ['usuarioId', 'activa'])
@Entity('sesiones_usuario', { schema: 'auth_security' })
export class SesionUsuario {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column('uuid', { name: 'usuario_id' })
  usuarioId: string;

  @Column('character varying', { name: 'token_hash', length: 255 })
  tokenHash: string;

  @Column('character varying', {
    name: 'dispositivo',
    nullable: true,
    length: 200,
  })
  dispositivo: string | null;

  @Column('inet', { name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column('text', { name: 'user_agent', nullable: true })
  userAgent: string | null;

  @Column('boolean', { name: 'activa', nullable: true, default: () => 'true' })
  activa: boolean | null;

  @Column('timestamp with time zone', { name: 'expira_en' })
  expiraEn: Date;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
