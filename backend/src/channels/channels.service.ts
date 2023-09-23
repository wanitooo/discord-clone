import { Injectable, Inject } from '@nestjs/common';
import { CreateChannelDto, UpdateChannelDto } from './dto/channels-dto';
// import { UpdateServerDto } from './dto/update-server.dto';
import { DRIZZLE_ORM, PostgresJsDb } from 'src/nest-drizzle';
import { channels } from 'src/nest-drizzle/discordSchema';
import { InferInsertModel, and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { PgColumn, PgDate, PgUUID, date } from 'drizzle-orm/pg-core';
import { isUndefined } from 'src/utils';

@Injectable()
export class ChannelsService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: PostgresJsDb) {}

  create(CreateChannelDto: CreateChannelDto) {
    const { name, serverId, type } = CreateChannelDto;

    const result = this.db.transaction(async (tx) => {
      const ins = await tx
        .insert(channels)
        .values({
          name,
          serverId,
          type,
        })
        .returning({
          insertedId: channels.id,
          insertedName: channels.name,
          insertedServerId: channels.serverId,
          insertedType: channels.type,
        });
      // console.log('ins', ins);
      // If ins not null tx.rollback()
      // add owner / creator as a member of the server
      if (ins[0].insertedServerId == null) {
        tx.rollback();
        return { message: 'Inserted serverId is null', inserted: ins[0] };
      }
      // const junc = await tx
      //   .insert(usersTochannels)
      //   .values({ serverId: ins[0].insertedId, userId: ins[0].insertedOwner })
      //   .returning({
      //     userId: usersTochannels.userId,
      //     serverId: usersTochannels.serverId,
      //   });

      return {
        createdChannelId: ins[0].insertedId,
        createdChannelName: ins[0].insertedName,
        createdServerId: ins[0].insertedServerId,
        createdType: ins[0].insertedType,
        inserted: ins ? true : false,
      };
    });
    return result;
  }

  findAllChannels() {
    return this.db
      .select({
        channelName: channels.name,
        channelId: channels.id,
        channelUUID: channels.uuid,
        channelServerId: channels.serverId,
        channelType: channels.type,
        createdAt: channels.createdAt,
        updatedAt: channels.updatedAt,
      })
      .from(channels)
      .orderBy(asc(channels.createdAt));
  }

  findAllChannelsInServer(id: number) {
    return this.db
      .select({
        channelName: channels.name,
        channelId: channels.id,
        channelUUID: channels.uuid,
        channelServerId: channels.serverId,
        channelType: channels.type,
        createdAt: channels.createdAt,
        updatedAt: channels.updatedAt,
      })
      .from(channels)
      .orderBy(asc(channels.createdAt))
      .where(eq(channels.serverId, id));
  }

  findAChannelInServer(serverId: number, channelId: string) {
    return this.db
      .select({
        channelName: channels.name,
        channelId: channels.id,
        channelUUID: channels.uuid,
        channelServerId: channels.serverId,
        channelType: channels.type,
        createdAt: channels.createdAt,
        updatedAt: channels.updatedAt,
      })
      .from(channels)
      .orderBy(asc(channels.createdAt))
      .where(
        // and(eq(channels.serverId, serverId), eq(channels.id, channelId)),
        and(eq(channels.serverId, serverId), eq(channels.uuid, channelId)),
      );
  }

  // findOne(id: number) {
  //   return this.db
  //     .select({
  //       name: channels.name,
  //       id: channels.id,
  //       uuid: channels.uuid,
  //       image: channels.image,
  //       serverOwner: channels.serverOwner,
  //       createdAt: channels.createdAt,
  //     })
  //     .from(channels)
  //     .where(eq(channels.serverOwner, id))
  //     .orderBy(asc(channels.createdAt));
  // }

  // update(uuid: string, updateServerDto: UpdateServerDto) {
  //   // console.log('UUID', uuid);

  //   const result = this.db.transaction(async (tx) => {
  //     const channelsSet: Partial<
  //       Record<keyof InferInsertModel<typeof channels>, any>
  //     > = {};

  //     // const upd = this.db.execute(
  //     //   sql`
  //     //   UPDATE ${channels}
  //     //   SET server_name = COALESCE(${name}, server_name),
  //     //       server_owner = COALESCE(${owner}, server_owner),
  //     //       hidden = COALESCE(${hidden}, hidden)
  //     //   WHERE server_uuid = ${uuid}
  //     //   `,
  //     // );
  //     const { name, serverOwner } = updateServerDto;
  //     const keysToUpdate: (keyof typeof channelsSet)[] = [
  //       'name',
  //       'serverOwner',
  //       'updatedAt',
  //       'image',
  //       'mode',
  //     ];
  //     const updatedDate = new Date();

  //     for (const key of keysToUpdate) {
  //       const value = updateServerDto[key];
  //       if (value !== undefined) {
  //         channelsSet[key] = value;
  //       }
  //     }

  //     const upd = await tx
  //       .update(channels)
  //       .set({ ...channelsSet, updatedAt: updatedDate })
  //       .where(eq(channels.uuid, uuid))
  //       .returning({
  //         UUID: channels.uuid,
  //         updatedName: channels.name,
  //         updatedOwner: channels.serverOwner,
  //         updatedDate: channels.updatedAt,
  //       });
  //     // console.log('ins', ins);
  //     // const junc = await tx
  //     //   .insert(usersTochannels)
  //     //   .values({ serverId: ins[0].insertedId, userId: ins[0].insertedOwner })
  //     //   .returning({
  //     //     userId: usersTochannels.userId,
  //     //     serverId: usersTochannels.serverId,
  //     //   });

  //     // return {
  //     //   serverName: ins[0].insertedName,
  //     //   serverOwner: ins[0].insertedOwner,
  //     //   inserted: ins ? true : false,
  //     //   junctionConnected: junc ? true : false,
  //     // };
  //   });
  //   return result;
  // }

  // remove(uuid: string) {
  //   return this.db
  //     .delete(channels)
  //     .where(eq(channels.uuid, uuid))
  //     .returning({ deletedName: channels.name, deletedUUID: channels.uuid });
  // }
}
