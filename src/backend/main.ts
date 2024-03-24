import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { Request } from 'express';
import mongoose from 'mongoose';
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

  const logMiddleware = morgan('short', {
    stream: { write: m => logger.http(m.trim()) },
  });

  app.use((req: Request, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return logMiddleware(req, res, next);
    }

    next();
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('vACDM')
    .setDescription('vACDM API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  (async () => {
    try {
      await mongoose.syncIndexes();
      logger.info('Synced indexes to MongoDB!');
    } catch (error) {
      logger.warn('Failed to sync indexes to MongoDB: %o', error);
    }
  })();

  await app.listen(3000);
}

bootstrap();
