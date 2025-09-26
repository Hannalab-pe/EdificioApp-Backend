import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Contrato } from './Contrato';

@Index('historial_contrato_pkey', ['id'], { unique: true })
@Entity('historial_contrato', { schema: 'people_management' })
export class HistorialContrato {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('enum', {
    name: 'accion',
    enum: ['CREADO', 'MODIFICADO', 'RENOVADO', 'TERMINADO', 'SUSPENDIDO'],
  })
  accion: 'CREADO' | 'MODIFICADO' | 'RENOVADO' | 'TERMINADO' | 'SUSPENDIDO';

  @Column('date', { name: 'fecha_accion' })
  fechaAccion: string;

  @Column('text', { name: 'motivo', nullable: true })
  motivo: string | null;

  @Column('jsonb', { name: 'detalles', nullable: true })
  detalles: object | null;

  @Column('uuid', { name: 'usuario_responsable_id', nullable: true })
  usuarioResponsableId: string | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @ManyToOne(() => Contrato, (contrato) => contrato.historialContratoes)
  @JoinColumn([{ name: 'contrato_id', referencedColumnName: 'id' }])
  contrato: Contrato;
}
