import mongoose, { HydratedDocument } from 'mongoose';

import Airport from '@/shared/interfaces/airport.interface';

export type AirportDocument = HydratedDocument<Airport>;

const airportSchema = new mongoose.Schema(
  {
    icao: { type: String, unique: true },
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
  },
  { timestamps: true },
);

export default mongoose.model<AirportDocument>('Airport', airportSchema);
