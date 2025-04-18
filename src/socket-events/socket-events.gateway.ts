import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CellClickedData } from 'src/interface/common.interfaces';

export type Player = {
  id: string;
  // name: string;
};

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
  },
  namespace: '/',
})
export class SocketEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  onlinePlayer: Player[] = [];
  constructor() {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(client.handshake.auth);

    const authenticatedUserId: string = String(client.handshake.auth.user_id);
    await client.join(authenticatedUserId);
    this.onlinePlayer.push({ id: authenticatedUserId });
    console.log(`Client connected with user id: ${authenticatedUserId}`);
  }

  handleDisconnect(client: Socket) {
    const authenticatedUserId: string = String(client.handshake.auth.user_id);
    console.log(`Client disconnected with user id: ${authenticatedUserId}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    console.log({ data });
    return data;
  }

  @SubscribeMessage('cell-clicked')
  handelCellClicked(
    @MessageBody() data: CellClickedData & string,
    @ConnectedSocket() client: Socket,
  ): CellClickedData {
    const connectedPlayerId: string = data[1];
    console.log(connectedPlayerId);
    client.to(connectedPlayerId).emit('cell-clicked', data);
    return data;
  }
}
