import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from '../users.controller';
import { Usuario, DocumentoIdentidad, Rol } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, DocumentoIdentidad, Rol]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}