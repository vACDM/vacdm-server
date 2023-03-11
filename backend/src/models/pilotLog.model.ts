import mongoose, { HydratedDocument } from 'mongoose';
import { PilotLog } from '@shared/interfaces/pilot.interface';

export type PilotLogDocument = HydratedDocument<PilotLog>;

export const pilotLogSchema = new mongoose.Schema(
  {
    pilot: String,
    time: {
      type: Date,
      default: () => new Date(),
    },
    namespace: String,
    action: String,
    data: Object,
  },
  { timestamps: true }
);

export default mongoose.model<PilotLogDocument>('PilotLog', pilotLogSchema);
