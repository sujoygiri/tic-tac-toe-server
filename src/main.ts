import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as connectPgSimple from 'connect-pg-simple';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { DbService } from './db/db.service';
// import { RequestTimeoutException } from '@nestjs/common';

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
    cors: { origin: 'http://localhost:4200', credentials: true },
    abortOnError: false,
    logger: false,
  });
  const configService = app.get(ConfigService);
  const sessionSecret = configService.get<string>('SESSION_SECRET') ?? '';
  const dbService = app.get(DbService);
  const sessionMiddleware = session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    name: '_SSID',
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
  });
  app.use(sessionMiddleware);
  // const nodeHttpServer = createServer()
  await app.listen(process.env.PORT ?? 3000);
  serverUrl = await app.getUrl();
}

bootstrap()
  .then(() => {
    console.log(`Server is running on ${serverUrl}`);
  })
  .catch((error) => {
    console.warn(error);
    // throw new RequestTimeoutException(error, {
    //   description: 'Network error! Please check your connection.',
    // });
  });
