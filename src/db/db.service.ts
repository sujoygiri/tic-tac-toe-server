import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig, QueryResult } from 'pg';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  public pool: Pool;

  constructor(private configService: ConfigService) {}

  private get poolConfig(): PoolConfig {
    const dbName = this.configService.get<string>('POSTGRES_DB_NAME');
    const dbRole = this.configService.get<string>('POSTGRES_DB_ROLE');
    const dbPassword = this.configService.get<string>('POSTGRES_DB_PASS');
    return {
      connectionString: `postgresql://${dbRole}:${dbPassword}@ep-cool-scene-a1v2bclw.ap-southeast-1.aws.neon.tech/${dbName}?sslmode=require`,
    };
  }

  async onModuleInit() {
    this.pool = new Pool(this.poolConfig);
    try {
      await this.pool.connect();
      console.log('PostgreSQL pool connected successfully!');
    } catch (error) {
      console.error('Error connecting to PostgreSQL:', error);
      throw new Error('Failed to connect to PostgreSQL');
    }
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
      throw new Error('Something went wrong');
    } finally {
      client.release();
    }
  }
}
