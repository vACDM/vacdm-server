import mongoose, { Model, Schema } from 'mongoose';

import ArchivedPilot from '../../shared/interfaces/archivedPilot.interface';
import { DB_PROVIDER } from '../database.module';
import { PilotSchema } from '../pilot/pilot.model';

export const ARCHIVEDPILOT_MODEL = 'ARCHIVEDPILOT_MODEL';
export type ArchivedPilotModel = Model<ArchivedPilot>;

const ArchivedPilotSchema = PilotSchema.clone() as Schema;

ArchivedPilotSchema.path('callsign').options.unique = false;

ArchivedPilotSchema.add({
  archivedAt: { type: Date, default: Date.now },
});

export const ArchivedPilotModelProvider = {
  provide: ARCHIVEDPILOT_MODEL,
  useFactory: (connection: typeof mongoose) => connection.model('ArchivedPilot', ArchivedPilotSchema),
  inject: [DB_PROVIDER],
};
