import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities';

export interface JwtPayload {
    sub: number;
    email: string;
    rol: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET', 'your-super-secret-jwt-key'),
        });
    }

    async validate(payload: JwtPayload): Promise<Usuario> {
        const { sub: userId } = payload;

        const usuario = await this.usuarioRepository.findOne({
            where: { id: userId, activo: true },
            relations: ['rol', 'documentoIdentidad'],
        });

        if (!usuario) {
            throw new UnauthorizedException('Usuario no encontrado o inactivo');
        }

        // Verificar si el usuario está bloqueado
        if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
            throw new UnauthorizedException('Usuario temporalmente bloqueado');
        }

        // Actualizar último acceso
        await this.usuarioRepository.update(userId, {
            ultimoAcceso: new Date(),
        });

        return usuario;
    }
}