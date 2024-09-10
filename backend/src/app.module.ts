import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NestDrizzleClientModule } from './nest-drizzle/client/module';
import { ServersModule } from './servers/servers.module';
import { ChannelsModule } from './channels/channels.module';
import { ChatsModule } from './chats/chats.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: []
      envFilePath: '.env',
    }),
    // GlobalModule,
    NestDrizzleClientModule,
    ServersModule,
    ChannelsModule,
    ChatsModule,
    UploadModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
