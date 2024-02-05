import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto, insertChannelSchema } from './dto/channels-dto';
import { ZodPipe } from 'src/pipes/zod-pipe';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  // TODO: add Zod validation to other routes
  @Post()
  async create(
    @Body(new ZodPipe(insertChannelSchema)) channel: CreateChannelDto,
  ) {
    try {
      var result: any = await this.channelsService.create(channel);
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        'Failed to create channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }

  @Get('/all')
  findAllChannels() {
    const channels = this.channelsService.findAllChannels();
    if (!channels) {
      return { message: 'No channels found' };
    }
    return channels;
  }
  @Get(':serverId')
  findAllChannelsInServer(@Param('serverId') id: string) {
    const channels = this.channelsService.findAllChannelsInServer(+id);
    if (!channels) {
      return { message: 'No channels found' };
    }
    return channels;
  }

  @Get(':serverId/:channelId')
  findAChannelsInServer(
    @Param('serverId') serverId: string,
    @Param('channelId') channelId: string,
  ) {
    const channel = this.channelsService.findAChannelInServer(
      +serverId,
      channelId,
    );
    if (!channel) {
      return { message: 'No channel found' };
    }
    return channel;
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.channelsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
  //   return this.channelsService.update(+id, updateChannelDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.channelsService.remove(+id);
  // }
}
