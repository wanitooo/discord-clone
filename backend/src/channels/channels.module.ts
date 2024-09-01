import { forwardRef, Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { ServersModule } from 'src/servers/servers.module';

@Module({
  imports: [forwardRef(() => ServersModule)],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
