import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [ChannelsModule],
  providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
