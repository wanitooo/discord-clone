import { forwardRef, Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { UploadModule } from 'src/upload/upload.module';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [UploadModule, forwardRef(() => ChannelsModule)],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService],
})
export class ServersModule {}
