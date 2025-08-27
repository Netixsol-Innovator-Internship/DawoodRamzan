/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private userSockets = new Map<string, string>(); // userId -> socketId
  afterInit() {
    // expose instance for notifications service to require
    (global as any).realtimeGatewayInstance = this;
  }
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) this.userSockets.set(userId, client.id);
    console.log('Client connected', client.id, 'userId:', userId);
  }
  handleDisconnect(client: Socket) {
    for (const [uid, sid] of this.userSockets.entries()) {
      if (sid === client.id) this.userSockets.delete(uid);
    }
    console.log('Client disconnected', client.id);
  }
  sendToUser(userId: string, payload: any) {
    const sid = this.userSockets.get(userId);
    this.server.emit('comment:new', 'cgh');

    if (sid) {
      this.server.to(sid).emit('notification', payload);
    }
  }
}
// export for require-based import
module.exports.realtimeGatewayInstance =
  (global as any).realtimeGatewayInstance || null;
export const realtimeGatewayInstance =
  (global as any).realtimeGatewayInstance || null;
