import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketEventsModule } from './socket-events/socket-events.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    SocketEventsModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
