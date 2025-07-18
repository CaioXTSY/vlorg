import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Novo Nome', description: 'Nome completo do usuário' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'novo@exemplo.com', description: 'E‑mail válido' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'senhaNova123', description: 'Senha com no mínimo 6 caracteres' })
  @IsOptional()
  @MinLength(6)
  password?: string;

}
