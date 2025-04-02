import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidUnknownValues: true,
  }));

  const configDocs = new DocumentBuilder()
    .setTitle('Orders service')
    .setDescription('This is a description of the ordering service api.')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, configDocs);

  SwaggerModule.setup('api', app, documentFactory);
  
  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start the app:', err);
  process.exit(1);
});
