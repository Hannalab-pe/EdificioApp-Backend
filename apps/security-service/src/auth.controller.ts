import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    Put,
    Param,
    Delete,
    Query
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiParam,
    ApiQuery
} from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { NivelAcceso } from './entities/rol.entity';
import { LoginDto, RegisterDto, AuthResponseDto, UserInfoDto, ChangePasswordDto } from './dto/auth.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'Login exitoso' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiBody({ type: RegisterDto })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
    async logout(@Request() req) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        return this.authService.logout(req.user.id, token);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
    @ApiResponse({ status: 200, description: 'Perfil del usuario' })
    getProfile(@Request() req) {
        return this.authService.getProfile(req.user.id);
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cambiar contraseña' })
    @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente' })
    @ApiBody({ type: ChangePasswordDto })
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(req.user.id, changePasswordDto);
    }

    @Get('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(NivelAcceso.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener lista de usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async getUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
        return this.authService.getUsers({ page, limit });
    }

    @Post('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(NivelAcceso.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
    @ApiBody({ type: CreateUserDto })
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.createUser(createUserDto);
    }

    @Get('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(NivelAcceso.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiResponse({ status: 200, description: 'Datos del usuario' })
    @ApiParam({ name: 'id', type: Number })
    async getUserById(@Param('id') id: number) {
        return this.authService.getUserById(id);
    }

    @Put('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(NivelAcceso.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar usuario' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateUserDto })
    async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.authService.updateUser(id, updateUserDto);
    }

    @Delete('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(NivelAcceso.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar usuario' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
    @ApiParam({ name: 'id', type: Number })
    async deleteUser(@Param('id') id: number) {
        return this.authService.deleteUser(id);
    }

    @Get('roles')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(NivelAcceso.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener lista de roles' })
    @ApiResponse({ status: 200, description: 'Lista de roles' })
    async getRoles() {
        return this.authService.getRoles();
    }

    @Get('permissions')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(NivelAcceso.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener lista de permisos' })
    @ApiResponse({ status: 200, description: 'Lista de permisos' })
    async getPermissions() {
        return this.authService.getPermissions();
    }
}