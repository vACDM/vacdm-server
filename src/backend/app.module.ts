import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import mongoose from 'mongoose';

import config from './config';

const databaseProviders = [
  {
    provide: 'DB',
    useFactory: () => {
      mongoose.set('strictQuery', true);
      return mongoose.connect(config().mongoUri);
    },
  },
];

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class AppModule {}
