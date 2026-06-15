export interface EnvConfig {
  getAppPort(): number;
  getNodeEnv(): string;
  getDatabaseUrl(): string;
  getJwtSecret(): string;
}
