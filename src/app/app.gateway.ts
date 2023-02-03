import { join } from 'path';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from '../app.service';
import { Chat } from '../chat.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  users: { [key: string]: string };
  admins: { [key: string]: Array<string> };
  constructor(private appService: AppService) {
    this.users = {};
    this.admins = {};
  }
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log(server);
    //Do stuffs
  }
  handleConnection(client: any, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Do stuffs
  }
  handleDisconnect(client: any) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }
  @SubscribeMessage('sendMessage')
  async handleMessage(client: any, payload: any): Promise<void> {
    console.log('new message ' + payload.text);
    // await this.appService.createMessage(payload);
    if (payload.type == 'user') {
      this.server.to(payload.to).emit('newMessage', payload);
    }

    if (payload.type == 'admin') {
      this.server.to(this.users[payload.to]).emit('newMessage', payload);
      this.server.to(payload.siteId).emit('newMessage', payload);
    }
  }

  @SubscribeMessage('join')
  async handleJoin(client: any, payload: any): Promise<void> {
    if (payload.type == 'admin') {
      if (!Object.keys(this.admins).includes(payload.siteId)) {
        this.admins[payload.siteId] = [];
      }
      this.admins[payload.siteId].push(client.id);
      client.join(payload.siteId);
    }

    if (payload.type == 'user') {
      this.users[payload.email] = client.id;
      this.server.to(payload.siteId).emit('join', payload);
    }
  }
}
