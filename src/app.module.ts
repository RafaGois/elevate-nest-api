import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { constants } from './auth/constants';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: constants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    EnvConfigModule.forRoot({}),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
