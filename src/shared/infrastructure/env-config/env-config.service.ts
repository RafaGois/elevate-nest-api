import { Injectable } from '@nestjs/common';
import { EnvConfigInterface } from './env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements EnvConfigInterface {
  constructor(private configService: ConfigService) {}
  getAppPort(): number {
    return Number(this.configService.get<number>('APP_PORT'));
  }

  getNodeEnv(): string {
    return String(this.configService.get<string>('NODE_ENV'));
  }

  getDatabaseUrl(): string {
    return String(this.configService.get<string>('DATABASE_URL'));
  }

  getJwtSecret(): string {
    return String(this.configService.get<string>('JWT_SECRET'));
  }
}
