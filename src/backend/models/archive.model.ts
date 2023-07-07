import mongoose, { HydratedDocument } from 'mongoose';

import { pilotSchema } from '../models/pilot.model';
import { pilotLogSchema } from '../models/pilotLog.model';

import { Archive } from '@/shared/interfaces/pilot.interface';

export type ArchiveDocument = HydratedDocument<Archive>;

const archiveSchema = new mongoose.Schema(
  {
    pilot: pilotSchema,
    logs: [pilotLogSchema],
  },
  { timestamps: true },
);

export default mongoose.model('Archive', archiveSchema);
