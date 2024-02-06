import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ConfigService } from '@nestjs/config';
// import { UploadService } from './upload.service';

@Controller('files')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}
  @Post('upload/')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
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
  ) {
    // console.log(file);
    const s3Response = await this.uploadService.upload(
      file.originalname,
      file.buffer,
    );
    if (s3Response.$metadata.httpStatusCode == 200) {
      return { msg: 'Successfully uploaded file', url: s3Response.url };
    }
  }

  // @Get('retrieve/:id')
  // async getFile(@Param('id') key: string) {
  //   const r = await this.uploadService.retrieve(key);
  //   console.log(r);
  //   return r.Body.
  // }
}
