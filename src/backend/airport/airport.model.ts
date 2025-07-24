import mongoose, { HydratedDocument, Model } from 'mongoose';

import { DB_PROVIDER } from '../database.module';

import IAirport from '@/shared/interfaces/airport.interface';

export const AIRPORT_MODEL = 'AIRPORT_MODEL';
export type AirportModel = Model<IAirport>;
export type AirportDocument = HydratedDocument<IAirport>;

const AirportSchema = new mongoose.Schema<IAirport>({
  icao: { type: String, unique: true },
  defaultTaxitime: { type: Number, required: true },
  taxizones: [{
    polygon: [String],
    taxitimes: [
      {
        rwy_designator: String,
        minutes: Number,
      },
    ],
    label: { type: String, default: '' },
    taxiout: { type: Boolean },
  }],
  profiles: [{
    capacities: [{
      runways: [String],
      capacity: { type: Number, required: true },
      alias: { type: String, default: (cap) => cap?.runways?.join(',') },
    }],
    forceActive: { type: Boolean, default: false },
    default: { type: Boolean, default: false },
    label: { type: String, default: '' },

    timetable: {
      from: { type: Number, required: true },
      until: { type: Number, required: true },
    },
  }],
}, { timestamps: true });

export const AirportProvider = {
  provide: AIRPORT_MODEL,
  useFactory: (connection: typeof mongoose) => connection.model('Airport', AirportSchema),
  inject: [DB_PROVIDER],
};
