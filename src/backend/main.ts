import { NestFactory } from '@nestjs/core';
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
  
  app.setGlobalPrefix('/api');

  app.use(morgan('short', { stream: { write: m => logger.http(m.trim()) } }));

  await app.listen(3000);
}
bootstrap();
