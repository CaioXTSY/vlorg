import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  prisma: any;
  getHello(): string {
    return 'Hello World!';
  }

  async testDatabase(): Promise<string> {
    try {
      const users = await this.prisma.user.findMany();
      return `Database connection successful. Found ${users.length} users.`;
    } catch (error) {
      console.error('Database connection error:', error);
      throw new Error('Failed to connect to the database.');
    }
  }
}
