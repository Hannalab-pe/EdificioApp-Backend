import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'permisos', schema: 'auth_security' })
export class Permiso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    modulo: string;

    @Column({ type: 'varchar', length: 50 })
    accion: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    recurso: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}