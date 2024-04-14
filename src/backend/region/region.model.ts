import mongoose, { HydratedDocument, Model } from 'mongoose';

import { DB_PROVIDER } from '../database.module';

import { Region } from '@/shared/interfaces/region.interface';

export const REGION_MODEL = 'REGION_MODEL';
export type RegionModel = Model<Region>;
export type RegionDocument = HydratedDocument<Region>;

const RegionSchema = new mongoose.Schema<Region>({
  label: { type: String, required: true },
  identifier: { type: String, required: true },

  parent: { type: String },

  airportPatterns: [{ type: String, required: true }],
}, { timestamps: true });

export const RegionProvider = {
  provide: REGION_MODEL,
  useFactory: (connection: typeof mongoose) => connection.model('Region', RegionSchema),
  inject: [DB_PROVIDER],
};
