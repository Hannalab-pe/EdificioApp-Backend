import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrendatario } from './Arrendatario';
import { ContactoEmergencia } from './ContactoEmergencia';
import { Contrato } from './Contrato';
import { EvaluacionTrabajador } from './EvaluacionTrabajador';
import { HistorialContrato } from './HistorialContrato';
import { HistorialResidencia } from './HistorialResidencia';
import { Inmobiliaria } from './Inmobiliaria';
import { PerfilPersona } from './PerfilPersona';
import { Propietario } from './Propietario';
import { Residente } from './Residente';
import { TipoContrato } from './TipoContrato';
import { Trabajador } from './Trabajador';

@Module({

    imports: [TypeOrmModule.forFeature([
        Arrendatario,
        ContactoEmergencia,
        Contrato,
        EvaluacionTrabajador,
        HistorialContrato,
        HistorialResidencia,
        Inmobiliaria,
        PerfilPersona,
        Propietario,
        Residente,
        TipoContrato,
        Trabajador,
    ])],
    exports: [TypeOrmModule],

})
export class EntitiesModule { }
