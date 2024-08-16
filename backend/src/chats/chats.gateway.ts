import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import {
  CreateMessageDto,
  GetMessagesDto,
  createMessageSchema,
  getMessagesSchema,
} from './dto/chat-dto';
import { ZodPipe } from 'src/pipes/zod-pipe';
import { HttpException, HttpStatus } from '@nestjs/common';
type MessageDto = {
  userId: string;
  message: string;
};

// TODO: separate join channel gateway for channel types, text v voiced
@WebSocketGateway({ cors: true })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatsService: ChatsService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {}

  handleDisconnect(client: any) {}

  @SubscribeMessage('sendMessage') // Subscribe to server_id?
  async handleMessage(
    @MessageBody(new ZodPipe(createMessageSchema)) chat: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.chatsService.create(chat);
    } catch (error) {
      // console.log(error);
      throw new HttpException('Failed to send message', HttpStatus.BAD_REQUEST);
    }
    this.server
      .to(`channel-${chat.channelId}`)
      .emit('newMessageEvent', 'new chat was created should update');
  }

  // @SubscribeMessage('get_messages') // Subscribe to server_id?
  // async handleGetMessages(
  //   @MessageBody() getMessage: GetMessagesDto,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   // console.log('client connected ', client);
  //   const messages = await this.chatsService.findAll(getMessage);
  //   console.log('messages: ', messages);
  //   this.server.emit(`receive_messages`, { messages });
  // }

  @SubscribeMessage('joinChannel')
  async joinChannel(
    @MessageBody() getMessage: any,
    @ConnectedSocket() client: Socket,
  ) {
    let { peerId, channelId, debug = 'from joinChannel' } = getMessage;
    console.log('~~~~client joined', client.id);
    client.join(`channel-${channelId}`);

    this.server.to(`channel-${channelId}`).emit('channelMessages', {
      channelId,
      message: 'joined channel',
      debug,
    });

    this.server.to(`channel-${channelId}`).emit('userJoined', { peerId });

    client.on('disconnect', () => {
      this.server.to(`channel-${channelId}`).emit('userDisconnected', {
        toDelete: peerId,
      });
      console.log('client', client.id, ' disconnect triggered');
    });
  }

  // Kept for reference, may not be needed
  @SubscribeMessage('getActiveChannelUsers')
  async getActiveChannelUsers(
    @MessageBody() getMessage: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, activeUsers, channelId, debug = '' } = getMessage;
    client.join(`channel-${channelId}`);

    this.server.to(`channel-${channelId}`).emit('activeChannelUsers', {
      channelId,
      activeUsers,
      message: 'sent from getActiveChannelUsers',
      debug,
    });
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(
    @MessageBody() getMessage: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { channelId } = getMessage;
    client.leave(`channel-${channelId}`);
    // console.log('Joined channel ', channelId);
    // console.log(client.rooms);
    this.server.to(`channel-${channelId}`).emit('channelMessages', {
      channelId,
      message: 'left channel',
    });
  }

  @SubscribeMessage('channelMessages') // Subscribe to server_id?
  async getChannelMessages(
    @MessageBody() message: GetMessagesDto,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('client connected ', client);
    const messages = await this.chatsService.findAll(message);
    // console.log('messages: ', messages);
    // console.log(client.rooms);

    this.server
      .to(`channel-${message.channelId}`)
      .emit('channelMessages', { messages });
  }
}
