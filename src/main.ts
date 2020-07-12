import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('my_context');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV == 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: process.env.ORIGIN });
    logger.log(`Accepting request from origin ${process.env.ORIGIN}`);
  }

  const port = 3000;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
