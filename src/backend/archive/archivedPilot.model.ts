import mongoose, { Model, Schema } from 'mongoose';

import ArchivedPilot from '../../shared/interfaces/archivedPilot.interface';
import { DB_PROVIDER } from '../database.module';
import { PilotSchema } from '../pilot/pilot.model';

export const ARCHIVEDPILOT_MODEL = 'ARCHIVEDPILOT_MODEL';
export type ArchivedPilotModel = Model<ArchivedPilot>;

// wild way to clone the schema and remove unique index on callsign
const ArchivedPilotSchema = new Schema({
  ...PilotSchema.obj,
  callsign: {
    ...(typeof PilotSchema.obj.callsign !== 'object' ? { type: String } : PilotSchema.obj.callsign),
    unique: false,
  },
});

// ts is a piece of trash and doesn't like it in the constructor above
ArchivedPilotSchema.add({
  archivedAt: { type: Date, default: Date.now },
});

export const ArchivedPilotModelProvider = {
  provide: ARCHIVEDPILOT_MODEL,
  useFactory: (connection: typeof mongoose) => connection.model('ArchivedPilot', ArchivedPilotSchema),
  inject: [DB_PROVIDER],
};
