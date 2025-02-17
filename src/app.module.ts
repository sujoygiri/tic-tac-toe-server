import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketEventsModule } from './socket-events/socket-events.module';

@Module({
  imports: [SocketEventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
