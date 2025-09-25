import { Module } from '@nestjs/common';
import { ArrendatarioController } from './arrendatario/arrendatario.controller';
import { ContactoEmergenciaController } from './contacto-emergencia/contacto-emergencia.controller';
import { ContratoController } from './contrato/contrato.controller';
import { EvaluacionTrabajadorController } from './evaluacion-trabajador/evaluacion-trabajador.controller';
import { HistorialContraotController } from './historial-contraot/historial-contraot.controller';
import { HistorialResidenciaController } from './historial-residencia/historial-residencia.controller';
import { InmobiliariaController } from './inmobiliaria/inmobiliaria.controller';
import { PerfilPersonaController } from './perfil-persona/perfil-persona.controller';
import { PropietarioController } from './propietario/propietario.controller';
import { ResidenteController } from './residente/residente.controller';
import { TipoContratoController } from './tipo-contrato/tipo-contrato.controller';
import { TrabajadorController } from './trabajador/trabajador.controller';

@Module({
    controllers: [
        ArrendatarioController,
        ContactoEmergenciaController,
        ContratoController,
        EvaluacionTrabajadorController,
        HistorialContraotController,
        HistorialResidenciaController,
        InmobiliariaController,
        PerfilPersonaController,
        PropietarioController,
        ResidenteController,
        TipoContratoController,
        TrabajadorController,
    ],
})
export class ControllersModule { }