import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Caio Teixeira', description: 'Nome completo do usuário' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'caio@exemplo.com', description: 'E-mail válido do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha com mínimo de 6 caracteres' })
  @MinLength(6)
  password: string;
}
