import { Module } from '@nestjs/common';
import mongoose from 'mongoose';

import config from './config';

export const DB_PROVIDER = 'DB';

export const databaseProviders = [
  {
    provide: DB_PROVIDER,
    useFactory: () => {
      mongoose.set('strictQuery', true);
      return mongoose.connect(config().mongoUri);
    },
  },
];


@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
