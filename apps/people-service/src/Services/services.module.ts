// services/services.module.ts
import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
import {
  ArrendatarioService,
  ContactoEmergenciaService,
  ContratoService,
  EvaluacionTrabajadorService,
  HistorialResidenciaService,
  InmobiliariaService,
  PerfilPersonaService,
  PropietarioService,
  ResidenteService,
  TipoContratoService,
  TrabajadorService,
} from './Implementations';
import { HistorialContratoService } from './Implementations/historial-contrato/historial-contrato.service';
import { SecurityServiceClient } from './clients/security-service.client';

@Module({
  imports: [EntitiesModule],
  providers: [
    // Servicios del people-service usando string tokens para interfaces
    {
      provide: 'IArrendatarioService',
      useClass: ArrendatarioService,
    },
    {
      provide: 'IContactoEmergenciaService',
      useClass: ContactoEmergenciaService,
    },
    {
      provide: 'IContratoService',
      useClass: ContratoService,
    },
    {
      provide: 'IEvaluacionTrabajadorService',
      useClass: EvaluacionTrabajadorService,
    },
    {
      provide: 'IHistorialContratoService',
      useClass: HistorialContratoService,
    },
    {
      provide: 'IHistorialResidenciaService',
      useClass: HistorialResidenciaService,
    },
    {
      provide: 'IInmobiliariaService',
      useClass: InmobiliariaService,
    },
    {
      provide: 'IPerfilPersonaService',
      useClass: PerfilPersonaService,
    },
    {
      provide: 'IPropietarioService',
      useClass: PropietarioService,
    },
    {
      provide: 'IResidenteService',
      useClass: ResidenteService,
    },
    {
      provide: 'ITipoContratoService',
      useClass: TipoContratoService,
    },
    {
      provide: 'ITrabajadorService',
      useClass: TrabajadorService,
    },

    // También exportar las clases directas para casos específicos
    ArrendatarioService,
    ContactoEmergenciaService,
    ContratoService,
    EvaluacionTrabajadorService,
    HistorialContratoService,
    HistorialResidenciaService,
    InmobiliariaService,
    PerfilPersonaService,
    PropietarioService,
    ResidenteService,
    TipoContratoService,
    TrabajadorService,

    // Cliente para comunicación con security-service
    SecurityServiceClient,
  ],
  exports: [
    // String tokens para interfaces
    'IArrendatarioService',
    'IContactoEmergenciaService',
    'IContratoService',
    'IEvaluacionTrabajadorService',
    'IHistorialContratoService',
    'IHistorialResidenciaService',
    'IInmobiliariaService',
    'IPerfilPersonaService',
    'IPropietarioService',
    'IResidenteService',
    'ITipoContratoService',
    'ITrabajadorService',

    // Clases directas
    ArrendatarioService,
    ContactoEmergenciaService,
    ContratoService,
    EvaluacionTrabajadorService,
    HistorialContratoService,
    HistorialResidenciaService,
    InmobiliariaService,
    PerfilPersonaService,
    PropietarioService,
    ResidenteService,
    TipoContratoService,
    TrabajadorService,

    // Cliente para comunicación con security-service
    SecurityServiceClient,
  ],
})
export class ServicesModule {}
