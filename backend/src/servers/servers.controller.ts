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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import {
  CreateServerDto,
  UpdateServerDto,
  insertServerSchema,
  updateServerSchema,
} from './dto/servers-dto';
// import { UpdateServerDto } from './dto/update-server.dto';
import {
  ZodPipe,
  // ZodTransformPipe,
  // ZodValidationPipe,
} from 'src/pipes/zod-pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileURLToPath } from 'url';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  // @UsePipes(
  //   // new ZodTransformPipe({ serverOwner: true }),
  //   new ZodValidationPipe(insertServerSchema),
  // )
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024, // 10 megabytes
          }),
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body(new ZodPipe(insertServerSchema)) serverParams: CreateServerDto,
  ) {
    // console.log(createServerDto);
    console.log('server ', serverParams);
    console.log('file ', file);
    return this.serversService.create(file, serverParams);
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
