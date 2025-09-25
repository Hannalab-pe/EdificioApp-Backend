import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionsModule } from '../permissions/permissions.module';
import { Rol } from '../entities/rol.entity';
import { Permiso } from '../entities/permiso.entity';
import { RolPermiso } from '../entities/rol-permiso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rol, Permiso, RolPermiso]),
    PermissionsModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}