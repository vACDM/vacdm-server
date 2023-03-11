import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { Archive } from '@shared/interfaces/pilot.interface';
import {pilotSchema} from '../models/pilot.model';
import {pilotLogSchema} from '../models/pilotLog.model';

export type ArchiveDocument = HydratedDocument<Archive>;

const archiveSchema = new mongoose.Schema(
  {
    pilot: pilotSchema,
    logs: [pilotLogSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Archive', archiveSchema);
