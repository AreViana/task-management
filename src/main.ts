import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('my_context');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  if (process.env.NODE_ENV == 'development') {
    app.enableCors();
    const options = new DocumentBuilder()
      .setTitle('Task Management API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('enpoints')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  } else {
    app.enableCors({ origin: process.env.ORIGIN });
    logger.log(`Accepting request from origin ${process.env.ORIGIN}`);
  }

  const port = 3000;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
