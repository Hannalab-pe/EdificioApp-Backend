import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipoDocumento {
    DNI = 'DNI',
    PASAPORTE = 'PASAPORTE',
    CARNET_EXTRANJERIA = 'CARNET_EXTRANJERIA'
}

@Entity({ name: 'documento_identidad', schema: 'auth_security' })
export class DocumentoIdentidad {
    @PrimaryGeneratedColumn('uuid')
    id_documento_identidad: string;

    @Column({
        type: 'enum',
        enum: TipoDocumento,
        name: 'tipo'
    })
    tipo: TipoDocumento;

    @Column({ type: 'varchar', length: 20 })
    numero: string;

    @Column({ type: 'varchar', length: 2, default: 'PE', name: 'pais_emision' })
    paisEmision: string;

    @Column({ type: 'date', nullable: true, name: 'fecha_emision' })
    fechaEmision: Date;

    @Column({ type: 'date', nullable: true, name: 'fecha_vencimiento' })
    fechaVencimiento: Date;

    @Column({ type: 'boolean', default: false })
    validado: boolean;

    @Column({ type: 'timestamptz', nullable: true, name: 'fecha_validacion' })
    fechaValidacion: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}