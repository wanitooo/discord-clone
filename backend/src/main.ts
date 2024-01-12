import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, Logger, ValidationPipe } from '@nestjs/common';
import { ZodFilter } from './exceptions/zod.exeception.filter';
async function bootstrap() {
  const prodLogLevels: LogLevel[] = ['log', 'error', 'warn'];
  const devLogLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  const logLevels =
    process.env.NODE_ENV === 'production' ? prodLogLevels : devLogLevels;

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  // Ping db here to see if connection was established
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  app.useGlobalFilters(new ZodFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  Logger.log(`Current log levels are: ${process.env.NODE_ENV}`);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
