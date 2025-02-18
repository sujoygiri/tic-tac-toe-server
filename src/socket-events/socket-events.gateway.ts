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
})
export class SocketEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  onlinePlayer: Player[] = [];
  constructor() {}

  handleConnection(client: Socket, ...args: any[]) {
    this.onlinePlayer.push({ id: client.id });
    console.log(`Client connected: ${client.id} arguments: ${args[0]}`);
  }

  handleDisconnect(client: Socket) {
    console.log(this.onlinePlayer);
    this.onlinePlayer = this.onlinePlayer.filter(
      (player) => player.id !== client.id,
    );
    console.log(this.onlinePlayer);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    console.log({ data });
    return data;
  }

  @SubscribeMessage('cell-clicked')
  handelCellClicked(
    @MessageBody() data: CellClickedData,
    @ConnectedSocket() client: Socket,
  ): CellClickedData {
    console.log(data, client.id);
    return data;
  }
}
