import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
    Request,
    Ip,
    Headers,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
    LoginDto,
    RegisterDto,
    AuthResponseDto,
    ChangePasswordDto,
    UserInfoDto,
} from '../dto/auth.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Usuario } from '../entities';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 409, description: 'Usuario ya existe' })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    async login(
        @Body() loginDto: LoginDto,
        @Ip() ipAddress: string,
        @Headers('user-agent') userAgent: string,
    ): Promise<AuthResponseDto> {
        return this.authService.login(loginDto, ipAddress, userAgent);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiResponse({ status: 200, description: 'Logout exitoso' })
    async logout(
        @CurrentUser() user: Usuario,
        @Request() req: any,
    ): Promise<void> {
        const token = req.headers.authorization?.replace('Bearer ', '');
        return this.authService.logout(user.id, token);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cambiar contraseña' })
    @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente' })
    @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta' })
    async changePassword(
        @CurrentUser() user: Usuario,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
        return this.authService.changePassword(user.id, changePasswordDto);
    }

    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refrescar token de acceso' })
    @ApiResponse({
        status: 200,
        description: 'Token refrescado',
        type: AuthResponseDto,
    })
    async refreshToken(@CurrentUser() user: Usuario): Promise<AuthResponseDto> {
        return this.authService.refreshToken(user.id);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener información del usuario actual' })
    @ApiResponse({
        status: 200,
        description: 'Información del usuario',
        type: UserInfoDto,
    })
    getProfile(@CurrentUser() user: Usuario): UserInfoDto {
        return {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            rol: {
                id: user.rol.id,
                nombre: user.rol.nombre,
                nivelAcceso: user.rol.nivelAcceso,
            },
            activo: user.activo,
        };
    }
}