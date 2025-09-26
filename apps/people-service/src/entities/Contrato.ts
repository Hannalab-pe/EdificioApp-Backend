import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TipoContrato } from './TipoContrato';
import { Trabajador } from './Trabajador';
import { HistorialContrato } from './HistorialContrato';

@Index('contrato_pkey', ['id'], { unique: true })
@Entity('contrato', { schema: 'people_management' })
export class Contrato {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('date', { name: 'fecha_inicio' })
  fechaInicio: string;

  @Column('date', { name: 'fecha_fin', nullable: true })
  fechaFin: string | null;

  @Column('numeric', { name: 'salario', precision: 10, scale: 2 })
  salario: string;

  @Column('text', { name: 'descripcion_cargo', nullable: true })
  descripcionCargo: string | null;

  @Column('enum', {
    name: 'estado',
    nullable: true,
    enum: ['VIGENTE', 'VENCIDO', 'TERMINADO', 'SUSPENDIDO'],
    default: () => "'VIGENTE'.estado_contrato",
  })
  estado: 'VIGENTE' | 'VENCIDO' | 'TERMINADO' | 'SUSPENDIDO' | null;

  @Column('character varying', {
    name: 'archivo_contrato_url',
    nullable: true,
    length: 500,
  })
  archivoContratoUrl: string | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @ManyToOne(() => TipoContrato, (tipoContrato) => tipoContrato.contratoes)
  @JoinColumn([{ name: 'tipo_contrato_id', referencedColumnName: 'id' }])
  tipoContrato: TipoContrato;

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.contratoes)
  @JoinColumn([{ name: 'trabajador_id', referencedColumnName: 'id' }])
  trabajador: Trabajador;

  @OneToMany(
    () => HistorialContrato,
    (historialContrato) => historialContrato.contrato,
  )
  historialContratoes: HistorialContrato[];
}
