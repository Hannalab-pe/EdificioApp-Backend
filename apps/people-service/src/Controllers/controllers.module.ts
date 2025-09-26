import { Module } from '@nestjs/common';
import { ServicesModule } from '../Services/services.module';
import { ArrendatarioController } from './arrendatario/arrendatario.controller';
import { ContactoEmergenciaController } from './contacto-emergencia/contacto-emergencia.controller';
import { ContratoController } from './contrato/contrato.controller';
import { EvaluacionTrabajadorController } from './evaluacion-trabajador/evaluacion-trabajador.controller';
import { HistorialContratoController } from './historial-contrato/historial-contrato.controller';
import { HistorialResidenciaController } from './historial-residencia/historial-residencia.controller';
import { InmobiliariaController } from './inmobiliaria/inmobiliaria.controller';
import { PerfilPersonaController } from './perfil-persona/perfil-persona.controller';
import { PropietarioController } from './propietario/propietario.controller';
import { ResidenteController } from './residente/residente.controller';
import { TipoContratoController } from './tipo-contrato/tipo-contrato.controller';
import { TrabajadorController } from './trabajador/trabajador.controller';

@Module({
  imports: [ServicesModule],
  controllers: [
    ArrendatarioController,
    ContactoEmergenciaController,
    ContratoController,
    EvaluacionTrabajadorController,
    HistorialContratoController,
    HistorialResidenciaController,
    InmobiliariaController,
    PerfilPersonaController,
    PropietarioController,
    ResidenteController,
    TipoContratoController,
    TrabajadorController,
  ],
})
export class ControllersModule {}
