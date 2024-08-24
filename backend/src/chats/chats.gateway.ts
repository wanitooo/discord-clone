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
      // console.log('received in controller ', chat);
      await this.chatsService.create(chat);
    } catch (error) {
      // console.log(error);
      throw new HttpException('Failed to send message', HttpStatus.BAD_REQUEST);
    }
    this.server
      .to(`channel-${chat.channelUUID}`)
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
    let { peerId, channelUUID, debug = 'from joinChannel' } = getMessage;
    console.log('~~~~client joined', client.id);
    client.join(`channel-${channelUUID}`);

    this.server.to(`channel-${channelUUID}`).emit('channelMessages', {
      channelUUID,
      message: 'joined channel',
      debug,
    });

    this.server.to(`channel-${channelUUID}`).emit('userJoined', { peerId });

    client.on('disconnect', () => {
      this.server.to(`channel-${channelUUID}`).emit('userDisconnected', {
        toDelete: peerId,
      });
      client.disconnect();
      console.log('client', client.id, ' disconnect triggered');
    });
  }

  // Kept for reference, may not be needed
  @SubscribeMessage('getActiveChannelUsers')
  async getActiveChannelUsers(
    @MessageBody() getMessage: any,
    @ConnectedSocket() client: Socket,
  ) {
    const {
      userId,
      activeUsers,
      channelUUID,
      serverUUID,
      debug = '',
    } = getMessage;
    client.join(`channel-${channelUUID}`);

    this.server.to(`channel-${channelUUID}`).emit('activeChannelUsers', {
      channelUUID,
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
    const { channelUUID } = getMessage;
    client.leave(`channel-${channelUUID}`);
    // console.log('Joined channel ', channelUUID);
    // console.log(client.rooms);
    this.server.to(`channel-${channelUUID}`).emit('channelMessages', {
      channelUUID,
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
      .to(`channel-${message.channelUUID}`)
      .emit('channelMessages', { messages });
  }
}
