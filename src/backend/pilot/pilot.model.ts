import mongoose, { HydratedDocument, Model, mongo } from 'mongoose';

import { DB_PROVIDER } from '../database.module';

import Pilot from '@/shared/interfaces/pilot.interface';

export const PILOT_MODEL = 'PILOT_MODEL';
export type PilotModel = Model<Pilot>;
export type PilotDocument = HydratedDocument<Pilot>;

const PilotSchema = new mongoose.Schema<Pilot>({
  callsign: { type: String, unique: true },

  position: {
    lat: Number,
    lon: Number,
  },

  vacdm: {
    eobt: { type: Date, default: -1 },
    tobt: { type: Date, default: -1 },
    tobtState: {
      type: String,
      enum: ['FLIGHTPLAN', 'CONFIRMED', 'NOW'],
      default: 'FLIGHTPLAN',
    },

    exot: { type: Number, default: -1 },
    manualExot: { type: Boolean, default: false },

    tsat: { type: Date, default: -1 },

    ctot: { type: Date, default: -1 },
    ttot: { type: Date, default: -1 },

    asrt: { type: Date, default: -1 },
    aort: { type: Date, default: -1 },

    asat: { type: Date, default: -1 },
    aobt: { type: Date, default: -1 },

    delay: { type: Number, default: 0 },
    prio: { type: Number, default: 0 },

    sug: { type: Date, default: -1 },
    pbg: { type: Date, default: -1 },
    txg: { type: Date, default: -1 },

    taxizone: { type: String, default: '' },
    taxizoneIsTaxiout: { type: Boolean, default: true },

    blockAssignment: { type: Date, default: () => new Date() },
    blockId: { type: Number, default: -1 },
    blockRwyDesignator: { type: String, default: '' },
  },
  hasBooking: { type: Boolean, default: false },

  flightplan: {
    adep: { type: String, default: '' },
    ades: { type: String, default: '' },
  },

  clearance: {
    dep_rwy: { type: String, default: '' },
    sid: { type: String, default: '' },
  },
  measures: [{ type: mongo.ObjectId, ref: 'EcfmpMeasure' }],
  inactive: { type: Boolean, default: false },
}, { timestamps: true });

export const PilotProvider = {
  provide: PILOT_MODEL,
  useFactory: (connection: typeof mongoose) => connection.model('Pilot', PilotSchema),
  inject: [DB_PROVIDER],
};
