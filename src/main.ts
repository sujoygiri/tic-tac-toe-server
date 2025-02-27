import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

let serverUrl: string = '';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    // logger: true,
    cors: { origin: 'http://localhost:4200' },
    abortOnError: false,
  });
  const configService = app.get(ConfigService);
  const redisClientId = configService.get<string>('REDIS_CLIENT_ID') ?? '';
  const sessionSecret = configService.get<string>('SESSION_SECRET') ?? '';
  const redisClient = createClient({
    url: `rediss://default:${redisClientId}@leading-alpaca-24942.upstash.io:6379`,
  });
  redisClient.on('connect', () => {
    console.log('Connected');
  });
  redisClient.on('error', (err) => {
    throw err;
  });
  await redisClient.connect();
  const redisStore = new RedisStore({
    client: redisClient,
  });
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        httpOnly: true,
      },
      store: redisStore,
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
