import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import logger from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });

  app.use(morgan('short', { stream: { write: m => logger.http(m.trim()) } }));

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
