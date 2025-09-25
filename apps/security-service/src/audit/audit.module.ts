import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditoriaAcceso } from '../entities/auditoria-acceso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditoriaAcceso])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}