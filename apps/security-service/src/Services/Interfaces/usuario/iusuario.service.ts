import {
    BaseResponseDto,
    CreateUsuarioDto,
    CreateUsuarioTrabajadorDto,
    UpdateUsuarioDto,
    UsuarioListResponseDto,
    UsuarioResponseDto,
    UsuarioTrabajadorCompositeDto,
} from '../../../dto';

export interface UsuarioQuery {
    page?: number;
    limit?: number;
    email?: string;
    activo?: boolean;
    rolId?: string;
    nombre?: string;
}

export interface IUsuarioService {
    create(data: CreateUsuarioDto): Promise<BaseResponseDto<UsuarioResponseDto>>;
    createWithTrabajador(data: CreateUsuarioTrabajadorDto): Promise<BaseResponseDto<UsuarioTrabajadorCompositeDto>>;
    findAll(query?: UsuarioQuery): Promise<BaseResponseDto<UsuarioListResponseDto>>;
    findOne(id: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    findByEmail(email: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    update(id: string, data: UpdateUsuarioDto): Promise<BaseResponseDto<UsuarioResponseDto>>;
    remove(id: string): Promise<BaseResponseDto<null>>;
    softDelete(id: string): Promise<BaseResponseDto<null>>;
    updateLastAccess(id: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    incrementFailedAttempts(id: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    resetFailedAttempts(id: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    blockUser(id: string, until: Date): Promise<BaseResponseDto<UsuarioResponseDto>>;
}
