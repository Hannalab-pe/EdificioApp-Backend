import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Usuario, NivelAcceso } from '../entities';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<NivelAcceso[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: Usuario = request.user;

        if (!user || !user.rol) {
            throw new ForbiddenException('Usuario no autenticado o sin rol asignado');
        }

        const hasRole = requiredRoles.includes(user.rol.nivelAcceso);
        if (!hasRole) {
            throw new ForbiddenException('No tienes permisos suficientes para acceder a este recurso');
        }

        return true;
    }
}