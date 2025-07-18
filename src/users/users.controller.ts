import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Query, Request, UseGuards, Patch, UseInterceptors, UploadedFile, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiProduces } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SearchUsersDto } from './dto/search-users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import { Response } from 'express';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import * as crypto from 'crypto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    this.ensureUploadsDirectory();
  }

  private ensureUploadsDirectory() {
    const uploadsPath = resolve(process.env.UPLOADS_PATH || './uploads', 'profile-pictures');
    if (!existsSync(uploadsPath)) {
      mkdirSync(uploadsPath, { recursive: true });
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retornar o perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado' })
  @Put('me')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Remover a conta do usuário logado' })
  @ApiResponse({ status: 200, description: 'Usuário removido' })
  @Delete('me')
  removeProfile(@Request() req) {
    return this.usersService.remove(req.user.userId);
  }
  
  @ApiOperation({ summary: 'Buscar usuários por nome ou email' })
  @ApiResponse({ status: 200, description: 'Lista de usuários encontrados' })
  @Get('search')
  search(@Query() searchDto: SearchUsersDto) {
    return this.usersService.searchUsers(searchDto);
  }

  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }


}
