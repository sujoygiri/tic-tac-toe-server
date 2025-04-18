import { Module } from '@nestjs/common';
import { SocketEventsGateway } from './socket-events.gateway';
import { PlayerActionsGateway } from './player-actions.gateway';

@Module({
  providers: [SocketEventsGateway, PlayerActionsGateway],
})
export class SocketEventsModule {}
