import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

export async function cleanDatabase(app: INestApplication): Promise<void> {
  const prisma = app.get(PrismaService);
  await prisma.user.deleteMany();
}

export async function closeTestApp(app: INestApplication): Promise<void> {
  const prisma = app.get(PrismaService);
  await prisma.$disconnect();
  await app.close();
}
