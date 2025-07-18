import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchUsersDto {
  @ApiProperty({
    description: 'Termo de busca (nome ou email)',
    example: 'joão',
    required: false
  })
  @IsOptional()
  @IsString()
  query?: string;
}