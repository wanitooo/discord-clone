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
import { channel } from 'diagnostics_channel';
import { HttpException, HttpStatus } from '@nestjs/common';
type MessageDto = {
  userId: string;
  message: string;
};
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
    const { userId, channelId } = getMessage;
    client.join(`channel-${channelId}`);
    console.log('user ', userId, ' joined channel ', channelId);
    // console.log(client.rooms);
    this.server.to(`channel-${channelId}`).emit('channelMessages', {
      channelId,
      message: 'joined channel',
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
