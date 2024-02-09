import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

// TODO: Not working, still allows requests even after violating the options
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow('UPLOAD_RATE_TTL'),
          limit: configService.getOrThrow('UPLOAD_RATE_LIMIT'),
        },
      ],
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class UploadModule {}
