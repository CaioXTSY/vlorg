import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  prisma: any;
  getHello(): string {
    return 'Hello World!';
  }
}
