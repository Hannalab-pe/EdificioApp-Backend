import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DocumentoIdentidad } from './documento-identidad.entity';
import { Rol } from './rol.entity';
import { SesionUsuario } from './sesion-usuario.entity';
import { AuditoriaAcceso } from './auditoria-acceso.entity';



@Entity({ name: 'usuario', schema: 'auth_security' })
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'documento_identidad_id' })
    documentoIdentidadId: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, name: 'password_hash' })
    passwordHash: string;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    apellidos: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono: string;

    @Column({ name: 'rol_id' })
    rolId: number;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @Column({ type: 'timestamptz', nullable: true, name: 'ultimo_acceso' })
    ultimoAcceso: Date;

    @Column({ type: 'int', default: 0, name: 'intentos_fallidos' })
    intentosFallidos: number;

    @Column({ type: 'timestamptz', nullable: true, name: 'bloqueado_hasta' })
    bloqueadoHasta: Date;

    @Column({ type: 'boolean', default: false, name: 'debe_cambiar_password' })
    debeCambiarPassword: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => DocumentoIdentidad)
    @JoinColumn({ name: 'documento_identidad_id' })
    documentoIdentidad: DocumentoIdentidad;

    @ManyToOne(() => Rol, rol => rol.usuarios)
    @JoinColumn({ name: 'rol_id' })
    rol: Rol;

    @OneToMany(() => SesionUsuario, sesion => sesion.usuario)
    sesiones: SesionUsuario[];

    @OneToMany(() => AuditoriaAcceso, auditoria => auditoria.usuario)
    auditorias: AuditoriaAcceso[];
}