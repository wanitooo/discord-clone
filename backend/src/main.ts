import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, Logger, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const prodLogLevels: LogLevel[] = ['log', 'error', 'warn'];
  const devLogLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  const logLevels =
    process.env.NODE_ENV === 'production' ? prodLogLevels : devLogLevels;

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  Logger.log(`Current log levels are: ${process.env.NODE_ENV}`);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
