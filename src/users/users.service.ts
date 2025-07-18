import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { SearchUsersDto } from './dto/search-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { name: string; email: string; password: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findAll(): Promise<Pick<User, 'id' | 'name' | 'email' | 'createdAt'>[]> {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true }
    });
  }

  async findById(id: number | string | undefined): Promise<Pick<User, 'id' | 'name' | 'email' | 'createdAt'>> {
    if (id === undefined || id === null) {
      throw new NotFoundException('ID de usuário não fornecido');
    }
      
    const userId = Number(id);
    if (isNaN(userId) || userId <= 0) {
      throw new NotFoundException('ID de usuário inválido');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true }
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.name === 'PrismaClientValidationError') {
        throw new BadRequestException('Parâmetros de busca inválidos');
      }

      if (error.code) {
        throw new BadRequestException(`Erro ao buscar usuário: ${error.message}`);
      }

      throw new BadRequestException('Erro ao processar solicitação');
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<Pick<User, 'id' | 'name' | 'email' | 'createdAt'>> {
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      throw new NotFoundException('ID de usuário inválido');
    }

    try {
      const data: any = { ...dto };
      if (dto.password) {
        data.password = await bcrypt.hash(dto.password, 10);
      }

      const user = await this.prisma.user.update({
        where: { id: Number(id) },
        data,
        select: { id: true, name: true, email: true, createdAt: true }
      });
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw new BadRequestException(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      throw new NotFoundException('ID de usuário inválido');
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.comment.deleteMany({ where: { authorId: Number(id) } });
        await prisma.post.deleteMany({ where: { authorId: Number(id) } });
        await prisma.profile.deleteMany({ where: { userId: Number(id) } });
        await prisma.user.delete({ where: { id: Number(id) } });
      });
      return { message: 'Usuário removido com sucesso' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw new BadRequestException(`Erro ao remover usuário: ${error.message}`);
    }
  }

  async searchUsers(searchParams: SearchUsersDto): Promise<Pick<User, 'id' | 'name' | 'email' | 'createdAt'>[]> {
    const { query } = searchParams;

    if (!query) {
      return [];
    }

    try {
      return this.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.name === 'PrismaClientValidationError') {
        throw new BadRequestException('Parâmetros de busca inválidos');
      }

      if (error.code) {
        throw new BadRequestException(`Erro ao buscar usuário: ${error.message}`);
      }

      throw new BadRequestException('Erro ao processar solicitação');
    }
  }
}