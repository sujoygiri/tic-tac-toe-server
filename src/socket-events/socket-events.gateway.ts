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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor() {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id} arguments: ${args[0]}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    console.log({ data });
    return data;
  }

  @SubscribeMessage('cell-clicked')
  handelCellClicked(
    @MessageBody() data: { rowIndex: number; cellIndex: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data, client.id);
    return data;
  }
}
