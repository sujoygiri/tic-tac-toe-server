import { Pool, PoolConfig } from "pg";

const config: PoolConfig = {
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_NAME),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

export const query = (text: string, params?: string[]) => {
  return pool.query(text, params);
};
