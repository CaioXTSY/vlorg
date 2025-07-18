import {Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(@Inject('DATABASE_URL') private readonly databaseUrl: string) {
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks() {
    this.$on('beforeExit', async () => {
      await this.$disconnect();
    });
  }
}