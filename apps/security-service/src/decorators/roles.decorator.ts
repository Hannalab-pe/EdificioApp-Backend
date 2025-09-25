import { SetMetadata } from '@nestjs/common';
import { NivelAcceso } from '../entities';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: NivelAcceso[]) => SetMetadata(ROLES_KEY, roles);