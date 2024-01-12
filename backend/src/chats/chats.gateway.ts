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
import { createMessageSchema } from './dto/chat-dto';
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

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody(new ZodPipe(createMessageSchema)) chat,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('client connected ', client);
    //  TODO: socket rooms map to channels =>
    const res = this.chatsService.create(chat);
    this.server.emit('receive_message', `res: ${res} `); // Broadcast the message to all connected clients
  }
}
