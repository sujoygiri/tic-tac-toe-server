import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let serverUrl: string = '';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    // logger: true,
    cors: { origin: 'http://localhost:4200' },
    abortOnError: false,
  });
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
