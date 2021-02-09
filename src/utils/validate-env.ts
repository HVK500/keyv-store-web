import 'dotenv/config';
import { bool, cleanEnv, json, num, port, str, CleanedEnvAccessors } from 'envalid';

let envConfig = {} as Readonly<any & CleanedEnvAccessors>;

export default function validateEnv(): void {
  envConfig = cleanEnv(process.env, {
    NODE_ENV: str(),
    API_KEY: str(),
    CONN_STRING: str({ default: '' }),
    STORE_OPTS: json({ default: {} }),
    MAX_CONN: num({ default: 100 }),
    MAX_CONN_AGE: num({ default: 300 }), // 300sec = 5min
    PORT: port({ default: 8050 }),
    EXPOSE_SWAGGER: bool({ default: false }),
    LOG_FILE: bool({ default: true })
  });
}

export const envValue = <T = string>(key: string): T => {
  return envConfig[key] as unknown as T;
}
