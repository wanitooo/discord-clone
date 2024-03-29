import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ParseIntPipe,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import {
  CreateServerDto,
  UpdateServerDto,
  insertServerSchema,
  updateServerSchema,
} from './dto/servers-dto';
// import { UpdateServerDto } from './dto/update-server.dto';
import { ZodTransformPipe, ZodValidationPipe } from 'src/pipes/zod-pipe';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  @UsePipes(
    new ZodTransformPipe({ serverOwner: true }),
    new ZodValidationPipe(insertServerSchema),
  )
  create(@Body() createServerDto: CreateServerDto) {
    // console.log(createServerDto);
    return this.serversService.create(createServerDto);
  }

  @Get()
  async findAll() {
    const servers = await this.serversService.findAll();
    // console.log('typeof ', typeof servers, 'SERVERS ', servers);
    // return {
    //   message: 'Found servers!',
    //   serversFound: servers,
    // };
    return servers;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serversService.findOne(+id);
  }

  @Patch(':uuid')
  // @UsePipes(new ZodValidationPipe(updateServerSchema))
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    console.log('PATCHHH', updateServerDto);
    console.log('UUID', uuid);
    return this.serversService.update(uuid, updateServerDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.serversService.remove(uuid);
  }
}
