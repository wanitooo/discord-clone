import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NestDrizzleClientModule } from './nest-drizzle/client/module';
import { ServersModule } from './servers/servers.module';
import { ChannelsModule } from './channels/channels.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: []
    }),
    // GlobalModule,
    NestDrizzleClientModule,
    ServersModule,
    ChannelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
