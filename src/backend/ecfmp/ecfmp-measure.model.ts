import mongoose, { HydratedDocument, Model, Schema } from 'mongoose';

import { DB_PROVIDER } from '../database.module';

import { EcfmpMeasure } from '@/shared/interfaces/ecfmp.interface';

export const ECFMP_MEASURE_MODEL = 'ECFMP_MEASURE_MODEL';
export type EcfmpMeasureModel = Model<EcfmpMeasure>;
export type EcfmpMeasureDocument = HydratedDocument<EcfmpMeasure>;

const EcfmpMeasureSchema = new mongoose.Schema<EcfmpMeasure>({
  id: { type: Number, default: null },
  ident: { type: String, required: true },
  event_id: { type: Number, default: null },
  enabled: { type: Boolean, default: true },
  reason: { type: String, default: '' },
  starttime: { type: Date, default: -1 },
  endtime: { type: Date, default: -1 },
  withdrawn_at: { type: Date, default: -1 },
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
}, { timestamps: true });

export const EcfmpMeasureProvider = {
  provide: ECFMP_MEASURE_MODEL,
  useFactory: (connection: mongoose.Connection) => connection.model('EcfmpMeasure', EcfmpMeasureSchema),
  inject: [DB_PROVIDER],
};
