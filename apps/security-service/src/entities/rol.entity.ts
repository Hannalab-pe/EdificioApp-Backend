import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { RolPermiso } from './rol-permiso.entity';




export enum NivelAcceso {
    ADMIN = 'ADMIN',
    CONDOMINIO = 'CONDOMINIO',
    RESIDENTE = 'RESIDENTE',
    TRABAJADOR = 'TRABAJADOR'
}

@Entity({ name: 'rol', schema: 'auth_security' })
export class Rol {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({
        type: 'enum',
        enum: NivelAcceso,
        name: 'nivel_acceso'
    })
    nivelAcceso: NivelAcceso;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Usuario, usuario => usuario.rol)
    usuarios: Usuario[];

    @OneToMany(() => RolPermiso, rolPermiso => rolPermiso.rol)
    rolPermisos: RolPermiso[];
}