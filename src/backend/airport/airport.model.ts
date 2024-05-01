import mongoose, { HydratedDocument, Model } from 'mongoose';

import { DB_PROVIDER } from '../database.module';

import Airport from '@/shared/interfaces/airport.interface';

export const AIRPORT_MODEL = 'AIRPORT_MODEL';
export type AirportModel = Model<Airport>;
export type AirportDocument = HydratedDocument<Airport>;

const AirportSchema = new mongoose.Schema<Airport>({
  icao: { type: String, unique: true },
  region: { type: String },
  standard_taxitime: { type: Number, required: true },
  taxizones: [
    {
      polygon: [String],
      taxitimes: [
        {
          rwy_designator: String,
          minutes: Number,
        },
      ],
      label: { type: String, default: '' },
      taxiout: { type: Boolean },
    },
  ],
  capacities: [
    {
      rwy_designator: String,
      capacity: Number,
      alias: String,
    },
  ],
}, { timestamps: true });

export const AirportProvider = {
  provide: AIRPORT_MODEL,
  useFactory: (connection: typeof mongoose) => connection.model('Airport', AirportSchema),
  inject: [DB_PROVIDER],
};
