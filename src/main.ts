import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as connectPgSimple from 'connect-pg-simple';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { DbService } from './db/db.service';

let serverUrl: string = '';

declare module 'express-session' {
  interface SessionData {
    views: number;
    userData: {
      user_id: string;
      name: string;
      email: string;
    };
  }
}

const pgSession = connectPgSimple(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    logger: false,
    cors: { origin: 'http://localhost:4200', credentials: true },
    abortOnError: false,
  });
  const configService = app.get(ConfigService);
  const sessionSecret = configService.get<string>('SESSION_SECRET') ?? '';
  const dbService = app.get(DbService);
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 5,
      },
      store: new pgSession({
        pool: dbService.pool,
        schemaName: 'primary',
        createTableIfMissing: true,
      }),
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  serverUrl = await app.getUrl();
}
bootstrap()
  .then(() => {
    console.log(`Server is running on ${serverUrl}`);
  })
  .catch((error) => {
    console.log(error);
  });
