import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SecurityServiceController } from './security-service.controller';
import { SecurityServiceService } from './security-service.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuditModule } from './audit/audit.module';
import { SecurityConfigModule } from './security-config/security-config.module';
import {
  DocumentoIdentidad,
  Permiso,
  Rol,
  RolPermiso,
  Usuario,
  SesionUsuario,
  AuditoriaAcceso,
  ConfiguracionSeguridad
} from './entities';

@Module({
  imports: [
    // Configuración
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'Dodod.123'),
        database: configService.get('DB_NAME', 'microservicio_condominio'),
        schema: 'auth_security',
        entities: [
          DocumentoIdentidad,
          Permiso,
          Rol,
          RolPermiso,
          Usuario,
          SesionUsuario,
          AuditoriaAcceso,
          ConfiguracionSeguridad
        ],
        synchronize: false, // En producción usar false y migrations
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production',
      }),
      inject: [ConfigService],
    }),

    // Entidades
    TypeOrmModule.forFeature([
      DocumentoIdentidad,
      Permiso,
      Rol,
      RolPermiso,
      Usuario,
      SesionUsuario,
      AuditoriaAcceso,
      ConfiguracionSeguridad
    ]),

    // Autenticación
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-super-secret-jwt-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '24h')
        },
      }),
      inject: [ConfigService],
    }),

    // Módulos funcionales
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuditModule,
    SecurityConfigModule,
  ],
  controllers: [SecurityServiceController, AuthController],
  providers: [
    SecurityServiceService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard
  ],
  exports: [SecurityServiceService, JwtAuthGuard, RolesGuard],
})
export class SecurityServiceModule { }
