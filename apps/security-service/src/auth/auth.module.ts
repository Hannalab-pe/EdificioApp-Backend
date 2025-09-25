import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import {
    Usuario,
    DocumentoIdentidad,
    Rol,
    SesionUsuario,
    AuditoriaAcceso
} from '../entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Usuario,
            DocumentoIdentidad,
            Rol,
            SesionUsuario,
            AuditoriaAcceso
        ]),
        PassportModule,
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
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }