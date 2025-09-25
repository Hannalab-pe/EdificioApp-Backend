import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityConfigService } from './security-config.service';
import { SecurityConfigController } from './security-config.controller';
import { ConfiguracionSeguridad } from '../entities/configuracion-seguridad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracionSeguridad])],
  controllers: [SecurityConfigController],
  providers: [SecurityConfigService],
  exports: [SecurityConfigService],
})
export class SecurityConfigModule {}