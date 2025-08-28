/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  afterInit() {
    (global as any).realtimeGatewayInstance = this;
    console.log('🚀 Realtime Gateway initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
    }
    console.log('✅ Client connected', client.id, 'userId:', userId);
  }

  handleDisconnect(client: Socket) {
    for (const [uid, sid] of this.userSockets.entries()) {
      if (sid === client.id) {
        this.userSockets.delete(uid);
      }
    }
    console.log('❌ Client disconnected', client.id);
  }

  /** Send a private notification to a specific user */
  sendToUser(userId: string, payload: any) {
    const sid = this.userSockets.get(userId);
    if (sid) {
      this.server.to(sid).emit('notification', payload);
      console.log(`📩 Sent to ${userId}:`, payload);
    } else {
      console.log(`⚠️ User ${userId} not connected, skipping`);
    }
  }

  /** Broadcast notification to all */
  sendToAll(payload: any) {
    this.server.emit('notification', payload);
    console.log('📢 Broadcast to all:', payload);
  }

  /** Broadcast new root-level comment */
  broadcastNewComment(comment: any) {
    this.server.emit('comment:new', comment);
    console.log('💬 New comment broadcasted:', comment);
  }
}

// Export for DI-less usage
module.exports.realtimeGatewayInstance =
  (global as any).realtimeGatewayInstance || null;
export const realtimeGatewayInstance =
  (global as any).realtimeGatewayInstance || null;
