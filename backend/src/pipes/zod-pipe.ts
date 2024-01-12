import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError, ZodObject } from 'zod';
import { ZodValidationException } from 'src/exceptions/zod-exceptions';

interface ZodTransformPipeInterface {
  serverOwner: boolean;
  // serverName: boolean;
}

export class ZodTransformPipe implements PipeTransform {
  constructor(private options: ZodTransformPipeInterface) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (this.options.serverOwner) {
      const { serverOwner, ...others } = value;
      const transformed = parseInt(serverOwner, 10);
      if (isNaN(transformed)) {
        throw new BadRequestException('Server owner not found');
      }
      // console.log('in zod pipe', { serverOwner: transformed, ...others });
      return { serverOwner: transformed, ...others };
    }
    // if (this.options.serverName) {
    //   const { name = value.serverName, ...others } = value;
    //   const transformed = name?.toString();
    //   if (!name) {
    //     throw new BadRequestException('Name to string failed');
    //   }
    //   return { serverName: transformed, };`
    // }
  }
}
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      console.log('VALUEEEE', value);
      this.schema.parse(value);
    } catch (error) {
      const exception = new ZodError(error);
      throw new ZodValidationException(exception);
    }
    return value;
  }
}

export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: any) {}
  transform(value: any, metadata: ArgumentMetadata) {
    this.schema.parse(value);
    return value;
  }
}
