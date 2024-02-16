import { Injectable, Inject } from '@nestjs/common';
import {
  CreateServerDto,
  UpdateServerDto,
  insertServerSchema,
} from './dto/servers-dto';
// import { UpdateServerDto } from './dto/update-server.dto';
import { DRIZZLE_ORM, PostgresJsDb } from 'src/nest-drizzle';
import { servers, usersToServers } from 'src/nest-drizzle/discordSchema';
import { InferInsertModel, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { PgColumn, PgDate, PgUUID, date } from 'drizzle-orm/pg-core';
import { isUndefined } from 'src/utils';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ServersService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: PostgresJsDb,
    private uploadService: UploadService,
  ) {}

  async create(file: Express.Multer.File, serverParams: CreateServerDto) {
    const s3Response = await this.uploadService.upload(
      file.originalname,
      file.buffer,
    );

    if (s3Response.$metadata.httpStatusCode == 200) {
      var uploadUrl = s3Response.url;
      console.log('Successfully uploaded file', uploadUrl);
    }
    // else {
    // return { msg: 'Could not upload file to S3', error: s3Response };
    // }

    const { name, serverOwner } = serverParams;

    const result = this.db.transaction(async (tx) => {
      const ins = await tx
        .insert(servers)
        .values({
          name,
          serverOwner,
          image: uploadUrl,
        })
        .returning({
          insertedId: servers.id,
          insertedName: servers.name,
          insertedOwner: servers.serverOwner,
          insertedImageUrl: servers.image,
        });
      // console.log('ins', ins);
      // If ins not null tx.rollback()
      // add owner / creator as a member of the server
      const junc = await tx
        .insert(usersToServers)
        .values({ serverId: ins[0].insertedId, userId: ins[0].insertedOwner })
        .returning({
          userId: usersToServers.userId,
          serverId: usersToServers.serverId,
        });

      // TODO: Should look for better ways to do this
      return {
        serverName: ins[0].insertedName,
        serverOwner: ins[0].insertedOwner,
        serverImage: ins[0].insertedImageUrl,
        inserted: ins ? true : false,
        junctionConnected: junc ? true : false,
      };
    });
    return result;
  }

  findAll() {
    const data = this.db
      .select({
        serverName: servers.name,
        serverId: servers.id,
        serverUUID: servers.uuid,
        serverImage: servers.image,
        serverOwner: servers.serverOwner,
        created: servers.createdAt,
      })
      .from(servers)
      .orderBy(asc(servers.createdAt));
    return data;
  }

  findOne(id: number) {
    return this.db
      .select({
        name: servers.name,
        id: servers.id,
        uuid: servers.uuid,
        image: servers.image,
        serverOwner: servers.serverOwner,
        createdAt: servers.createdAt,
      })
      .from(servers)
      .where(eq(servers.serverOwner, id))
      .orderBy(asc(servers.createdAt));
  }

  update(uuid: string, updateServerDto: UpdateServerDto) {
    // console.log('UUID', uuid);

    const result = this.db.transaction(async (tx) => {
      const serverQuerySet: Partial<Record<keyof typeof updateServerDto, any>> =
        {};

      // const upd = this.db.execute(
      //   sql`
      //   UPDATE ${servers}
      //   SET server_name = COALESCE(${name}, server_name),
      //       server_owner = COALESCE(${owner}, server_owner),
      //       hidden = COALESCE(${hidden}, hidden)
      //   WHERE server_uuid = ${uuid}
      //   `,
      // );
      const keysToUpdate: (keyof typeof serverQuerySet)[] = [
        'name',
        'serverOwner',
        'updatedAt',
        'image',
        'mode',
      ];
      const updatedDate = new Date();

      // Check if the value is defined in the request, if it is, update the server query
      for (const key of keysToUpdate) {
        const value = updateServerDto[key];
        if (value !== undefined) {
          serverQuerySet[key] = value;
        }
      }

      const upd = await tx
        .update(servers)
        .set({ ...serverQuerySet, updatedAt: updatedDate })
        .where(eq(servers.uuid, uuid))
        .returning({
          UUID: servers.uuid,
          updatedName: servers.name,
          updatedOwner: servers.serverOwner,
          updatedDate: servers.updatedAt,
        });
      // console.log('ins', ins);
      // const junc = await tx
      //   .insert(usersToServers)
      //   .values({ serverId: ins[0].insertedId, userId: ins[0].insertedOwner })
      //   .returning({
      //     userId: usersToServers.userId,
      //     serverId: usersToServers.serverId,
      //   });

      // return {
      //   serverName: ins[0].insertedName,
      //   serverOwner: ins[0].insertedOwner,
      //   inserted: ins ? true : false,
      //   junctionConnected: junc ? true : false,
      // };
    });
    return result;
  }

  remove(uuid: string) {
    return this.db
      .delete(servers)
      .where(eq(servers.uuid, uuid))
      .returning({ deletedName: servers.name, deletedUUID: servers.uuid });
  }
}
