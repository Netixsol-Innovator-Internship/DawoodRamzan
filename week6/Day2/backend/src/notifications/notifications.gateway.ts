/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*', credentials: false },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Emit a purchase notification to all clients
  broadcastPurchase(username: string, productName?: string) {
    const message = `${username} bought ${productName ?? 'an item'}`;
    this.server.emit('purchase', {
      user: username,
      product: productName,
      message,
    });
  }

  broadcastAdd(productName?: string) {
    const message = `Admin added ${productName ?? 'an item'}`;
    this.server.emit('add', {
      user: 'Admin',
      product: productName,
      message,
    });
  }
}
