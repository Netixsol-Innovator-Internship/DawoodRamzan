import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['*'],
    credentials: true,
  },
  namespace: '/comments',
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(socket: any) {
    console.log('Client connected:', socket.id);
  }

  handleDisconnect(socket: any) {
    console.log('Client disconnected:', socket.id);
  }

  emitNewComment(payload: any) {
    this.server.emit('new_comment', payload);
  }
}
