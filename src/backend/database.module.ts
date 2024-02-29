import { Module } from '@nestjs/common';
import Joi from 'joi';
import mongoose from 'mongoose';
import { JoiPipe } from 'nestjs-joi';

import getAppConfig from './config';

export const DB_PROVIDER = 'DB';

export const databaseProviders = [
  {
    provide: DB_PROVIDER,
    useFactory: () => {
      mongoose.set('strictQuery', true);
      return mongoose.connect(getAppConfig().mongoUri);
    },
  },
];

export const MongoObjectIdValidator = Joi.string().custom((value, helpers) => {
  const filtered = mongoose.isValidObjectId(value);
  return !filtered ? helpers.error('any.invalid') : value;
},
'invalid objectId' ).required();

export const joiPipeMongoId = new JoiPipe(MongoObjectIdValidator.required());

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
