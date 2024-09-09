import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreateMessageDto,
  GetMessagesDto,
  UpdateMessageDto,
} from './dto/chat-dto';
import { DRIZZLE_ORM } from 'src/nest-drizzle/constants';
import { PostgresJsDb } from 'src/nest-drizzle';
import { messages } from 'src/nest-drizzle/discordSchema';
import { eq, lt, gte, ne, asc } from 'drizzle-orm';
import { ChannelsService } from 'src/channels/channels.service';
@Injectable()
export class ChatsService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: PostgresJsDb,
    private readonly channelsService: ChannelsService,
  ) {}
  async create(message: CreateMessageDto) {
    console.log('chat ', message);
    const { userId, channelUUID, serverUUID, chat } = message;

    const channelId = await this.channelsService
      .findAChannelInServer(serverUUID, channelUUID)
      .then((channel) => channel.id)
      .catch((err) => console.log(err));

    // console.log(channelId);
    if (channelId) {
      var result = await this.db.transaction(async (tx) => {
        return await tx
          .insert(messages)
          .values({
            userId,
            channelId,
            chat,
          })
          .returning({
            insertedId: messages.id,
            insertedUserId: messages.userId,
            insertedChannelId: messages.channelId,
            insertedChat: messages.chat,
          });
      });
    }
    return result;
  }

  async findAll(get: GetMessagesDto) {
    console.log('get ', get);
    const { userId, channelUUID, serverUUID } = get;
    // console.log('in', channelUUID, serverUUID);

    const channelId = await this.channelsService
      .findAChannelInServer(serverUUID, channelUUID)
      .then((channel) => channel.id)
      .catch((err) => console.log(err));
    if (channelId) {
      var result = await this.db.transaction(async (tx) => {
        return await tx
          .select()
          .from(messages)
          .where(eq(messages.channelId, channelId))
          .orderBy(asc(messages.updatedAt));
      });
    }
    // console.log('RES ', result);
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateMessageDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
