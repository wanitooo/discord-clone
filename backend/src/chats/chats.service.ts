import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreateMessageDto,
  GetMessagesDto,
  UpdateMessageDto,
} from './dto/chat-dto';
import { DRIZZLE_ORM } from 'src/nest-drizzle/constants';
import { PostgresJsDb } from 'src/nest-drizzle';
import { messages } from 'src/nest-drizzle/discordSchema';
import { eq, lt, gte, ne } from 'drizzle-orm';
@Injectable()
export class ChatsService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: PostgresJsDb) {}
  async create(message: CreateMessageDto) {
    console.log('chat ', message);
    const { userId, channelId, chat } = message;
    const result = await this.db.transaction(async (tx) => {
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
    return result;
  }

  async findAll(get: GetMessagesDto) {
    console.log('get ', get);
    const { userId, channelId } = get;
    const result = await this.db.transaction(async (tx) => {
      return await tx
        .select()
        .from(messages)
        .where(eq(messages.channelId, channelId));
    });
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
