import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'configuracion_seguridad', schema: 'auth_security' })
export class ConfiguracionSeguridad {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    clave: string;

    @Column({ type: 'text' })
    valor: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}