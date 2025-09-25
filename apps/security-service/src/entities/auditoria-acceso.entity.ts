import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity({ name: 'auditoria_accesos', schema: 'auth_security' })
export class AuditoriaAcceso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, name: 'usuario_id' })
    usuarioId: number;

    @Column({ type: 'varchar', length: 100 })
    accion: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    recurso: string;

    @Column({ type: 'jsonb', nullable: true })
    detalles: any;

    @Column({ type: 'inet', nullable: true, name: 'ip_address' })
    ipAddress: string;

    @Column({ type: 'text', nullable: true, name: 'user_agent' })
    userAgent: string;

    @Column({ type: 'boolean' })
    exitoso: boolean;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'timestamp' })
    timestamp: Date;

    @ManyToOne(() => Usuario, usuario => usuario.auditorias)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Index(['accion'])
    @Column({ type: 'varchar', length: 100 })
    accion_index: string;

    @Index(['usuarioId', 'timestamp'])
    @Column({ type: 'timestamptz' })
    usuario_timestamp_index: Date;
}