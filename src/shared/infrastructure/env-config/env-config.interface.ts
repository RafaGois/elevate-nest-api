export interface EnvConfigInterface {
  getAppPort(): number;
  getNodeEnv(): string;
  getDatabaseUrl(): string;
  getJwtSecret(): string;
}
