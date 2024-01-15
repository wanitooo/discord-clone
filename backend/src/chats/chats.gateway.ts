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
type MessageDto = {
  userId: string;
  message: string;
};
@WebSocketGateway()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatsService: ChatsService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {}

  handleDisconnect(client: any) {}

  @SubscribeMessage('send_message') // Subscribe to server_id?
  handleMessage(
    @MessageBody(new ZodPipe(createMessageSchema)) chat: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('client connected ', client);
    this.chatsService.create(chat);
    this.server.emit('update_channelId', 'new chat was created should update');
  }

  @SubscribeMessage('get_messages') // Subscribe to server_id?
  async handleGetMessages(
    @MessageBody() getMessage: GetMessagesDto,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('client connected ', client);
    const messages = await this.chatsService.findAll(getMessage);
    console.log('messages: ', messages);
    this.server.emit(`receive_messages`, { messages });
  }
}
