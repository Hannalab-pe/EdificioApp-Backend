export class SecurityConfigResponseDto {
  id: number;
  clave: string;
  valor: string;
  descripcion?: string;
  activo: boolean;
  updatedAt: Date;
}