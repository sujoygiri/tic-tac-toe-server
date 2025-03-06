import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketEventsModule } from './socket-events/socket-events.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    SocketEventsModule,
    AuthModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
