import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class AuctionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Broadcast to all clients
  broadcastNewAuction(message: string) {
    this.server.emit('newAuction', message);
  }

  // Handle auction created event from client
  @SubscribeMessage('auctionCreated')
  handleAuctionCreated(client: Socket, message: string): void {
    // Broadcast to all clients except sender
    client.broadcast.emit('newAuction', message);
  }
}
