import { Module } from '@nestjs/common';
import Agenda from 'agenda';
import mongoose from 'mongoose';

import { DB_PROVIDER, DatabaseModule } from './database.module';

export const AGENDA_PROVIDER = 'AGENDA';

export const agendaProviders = [
  {
    provide: AGENDA_PROVIDER,
    useFactory: async (mongo: typeof mongoose) => {
      const agenda = new Agenda({
        mongo: mongo.connection.db,
        processEvery: '5 seconds',
      });

      await agenda.start();

      return agenda;
    },
    inject: [DB_PROVIDER],
  },
];

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [...agendaProviders],
  exports: [...agendaProviders],
})
export class AgendaModule {}
