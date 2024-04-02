import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  async upload(fileName: string, file: Buffer) {
    const urlFileName = uuidv4(); // spaces and special characters cause problems in the getPresignedUrl func in s3.ts
    try {
      var response = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
          Key: urlFileName,
          Body: file,
        }),
      );
    } catch (error) {
      throw new Error(error);
    }

    return {
      ...response,
      url: `https://${this.configService.get(
        'AWS_BUCKET_NAME',
      )}.s3.${this.configService.getOrThrow(
        'AWS_S3_REGION',
      )}.amazonaws.com/${urlFileName}`,
    };
  }
  //   async retrieve(key: string) {
  //     try {
  //         var response = await this.s3Client.
  //     } catch (error) {
  //       throw new Error(error);
  //     }
  //     return response;
  //   }
}

//   async retrieve(key: string) {
//     try {
//       var response = await this.s3Client.send(
//         new GetObjectCommand({
//           Key: key,
//           Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
//         }),
//       );
//     } catch (error) {
//       throw new Error(error);
//     }
//     return response;
//   }
// }
