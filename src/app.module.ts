import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketEventsModule } from './socket-events/socket-events.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SocketEventsModule,
    AuthModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
