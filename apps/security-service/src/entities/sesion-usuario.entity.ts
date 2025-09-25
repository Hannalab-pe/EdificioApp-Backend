import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity({ name: 'sesiones_usuario', schema: 'auth_security' })
export class SesionUsuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'usuario_id' })
    usuarioId: number;

    @Column({ type: 'varchar', length: 255, name: 'token_hash' })
    tokenHash: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    dispositivo: string;

    @Column({ type: 'inet', nullable: true, name: 'ip_address' })
    ipAddress: string;

    @Column({ type: 'text', nullable: true, name: 'user_agent' })
    userAgent: string;

    @Column({ type: 'boolean', default: true })
    activa: boolean;

    @Column({ type: 'timestamptz', name: 'expira_en' })
    expiraEn: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Usuario, usuario => usuario.sesiones)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Index(['tokenHash'])
    @Column({ type: 'varchar', length: 255 })
    token_hash_index: string;

    @Index(['usuarioId', 'activa'])
    @Column({ type: 'boolean' })
    usuario_activa_index: boolean;
}