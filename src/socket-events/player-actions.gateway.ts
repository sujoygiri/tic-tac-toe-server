import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
  },
  namespace: '/player_action',
})
export class PlayerActionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor() {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(client.handshake.auth);
    const userId: string = String(client.handshake.auth.user_id);
    await client.join(userId);
    console.log(
      `From namespace 'player_action' Client connected with user id: ${client.handshake.auth.user_id}`,
    );
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(
      `From namespace 'player_action' Client disconnected with user id: ${client.handshake.auth.user_id}`,
    );
  }

  @SubscribeMessage('inviteToPlay')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): string {
    console.log(client.handshake, payload);
    return 'Hello world!';
  }
}
