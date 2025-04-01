import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidUnknownValues: true,
  }));

  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start the app:', err);
  process.exit(1);
});
