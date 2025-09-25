import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Permiso } from './permiso.entity';

@Entity({ name: 'rol_permiso', schema: 'auth_security' })
export class RolPermiso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'rol_id' })
    rolId: number;

    @Column({ name: 'permiso_id' })
    permisoId: number;

    @Column({ type: 'boolean', default: true })
    concedido: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Rol, rol => rol.rolPermisos)
    @JoinColumn({ name: 'rol_id' })
    rol: Rol;

    @ManyToOne(() => Permiso)
    @JoinColumn({ name: 'permiso_id' })
    permiso: Permiso;
}