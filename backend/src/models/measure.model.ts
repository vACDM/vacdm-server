import mongoose, { HydratedDocument, Schema } from 'mongoose';
import {EcfmpMeasure} from '@shared/interfaces/ecfmp.interface';

export type EcfmpMeasureDocument = HydratedDocument<EcfmpMeasure>;

export const ecfmpMeasureSchema = new mongoose.Schema(
  {
    id: { type: Number, default: null },
    ident: { type: String, required: true },
    event_id: {type: Number, default: null},
    reason: { type: String, default: '' },
    starttime: { type: String, default: '' },
    endtime: { type: String, default: '' },
    withdrawn_at: { type: String, default: '' },
    notified_flight_information_regions: [Number],
    measure: {
      type: { type: String, default: '' },
      value: {type: Number, default: null},
    },
    filters: [
      {
        type: { type: String, default: '' },
        value: Schema.Types.Mixed
    }]
  },
  { timestamps: true }
);

export default mongoose.model<EcfmpMeasureDocument>('EcfmpMeasure', ecfmpMeasureSchema);
