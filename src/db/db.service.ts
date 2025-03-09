import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig, QueryResult } from 'pg';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  public pool: Pool = new Pool(this.poolConfig);

  constructor(private configService: ConfigService) {}

  private get poolConfig(): PoolConfig {
    const platformStatus = this.configService.get<string>('PLATFORM_STATUS');
    if (Number.parseInt(platformStatus ?? '1')) {
      const dbName = this.configService.get<string>('POSTGRES_DB_NAME');
      const dbRole = this.configService.get<string>('POSTGRES_DB_ROLE');
      const dbPassword = this.configService.get<string>('POSTGRES_DB_PASS');
      return {
        connectionString: `postgresql://${dbRole}:${dbPassword}@ep-cool-scene-a1v2bclw.ap-southeast-1.aws.neon.tech/${dbName}?sslmode=require`,
      };
    } else {
      const pgUser = this.configService.get<string>('PG_USER');
      const pgPassword = this.configService.get<string>('PG_PASSWORD');
      const pgHost = this.configService.get<string>('PG_HOST');
      const pgPort = this.configService.get<string>('PG_PORT');
      const pgDb = this.configService.get<string>('PG_DB');
      return {
        user: pgUser,
        password: pgPassword,
        host: pgHost,
        port: Number.parseInt(pgPort ?? '5432'),
        database: pgDb,
      };
    }
  }

  async onModuleInit() {
    await this.initializeTables();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query(queryText: string, values?: any[]): Promise<QueryResult<any>> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(queryText, values);
      return res;
    } catch (error) {
      console.error('Something went wrong:', error);
      throw new InternalServerErrorException(error, {
        description: 'Something went wrong',
      });
    } finally {
      client.release();
    }
  }

  async initializeTables() {
    const createUsersTable = `CREATE TABLE IF NOT EXISTS "primary".users (
    user_id UUID DEFAULT gen_random_uuid(),
    name VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL, 
    password VARCHAR NOT NULL,
    PRIMARY KEY (user_id)
    )`;
    try {
      await this.query(createUsersTable);
    } catch (error) {
      throw new InternalServerErrorException(error, {
        description: 'database initialization error',
      });
    }
  }
}
