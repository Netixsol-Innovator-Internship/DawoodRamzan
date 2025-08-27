/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notifModel: Model<Notification>,
  ) {}
  async notifyUser(userId: string, payload: any) {
    const n = new this.notifModel({ to: userId, payload });
    await n.save();
    // gateway broadcast — we will import gateway at runtime to avoidcircular dependency
    try {
      const gateway =
        require('../gateways/realtime.gateway').realtimeGatewayInstance;
      if (gateway)
        gateway.sendToUser(userId, { event: 'notification', data: n });
    } catch (e) {
      // ignore
    }
    return n;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async broadcastNewComment(comment: any) {
    try {
      const gateway =
        require('../gateways/realtime.gateway').realtimeGatewayInstance;
      if (gateway) gateway.server.emit('comment:new', comment);
    } catch (e) {
      /* empty */
    }
  }
}
