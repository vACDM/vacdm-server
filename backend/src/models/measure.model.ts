import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { EcfmpMeasure } from '@shared/interfaces/ecfmp.interface';
import timeUtils from '../utils/time.utils';

export type EcfmpMeasureDocument = HydratedDocument<EcfmpMeasure>;

export const ecfmpMeasureSchema = new mongoose.Schema(
  {
    id: { type: Number, default: null },
    ident: { type: String, required: true },
    event_id: { type: Number, default: null },
    enabled: { type: Boolean, default: true },
    reason: { type: String, default: '' },
    starttime: { type: Date, default: timeUtils.emptyDate },
    endtime: { type: Date, default: timeUtils.emptyDate },
    withdrawn_at: { type: Date, default: timeUtils.emptyDate },
    notified_flight_information_regions: [Number],
    measure: {
      type: { type: String, default: '' },
      value: { type: Number, default: null },
    },
    filters: [
      {
        type: { type: String, default: '' },
        value: Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<EcfmpMeasureDocument>('EcfmpMeasure', ecfmpMeasureSchema);
