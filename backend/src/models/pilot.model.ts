import mongoose, { HydratedDocument } from 'mongoose';
import timeUtils from '../utils/time.utils';
import Pilot from '@shared/interfaces/pilot.interface';

export type PilotDocument = HydratedDocument<Pilot>;

export const pilotSchema = new mongoose.Schema(
  {
    callsign: { type: String, unique: true },

    position: {
      lat: Number,
      lon: Number,
    },

    vacdm: {
      eobt: { type: Date, default: timeUtils.emptyDate },
      tobt: { type: Date, default: timeUtils.emptyDate },
      tobt_state: {
        type: String,
        enum: ['GUESS', 'FLIGHTPLAN', 'CONFIRMED', 'NOW'],
        default: 'GUESS',
      },

      exot: { type: Number, default: -1 },
      manual_exot: { type: Boolean, default: false },

      tsat: { type: Date, default: timeUtils.emptyDate },

      ctot: { type: Date, default: timeUtils.emptyDate },
      ttot: { type: Date, default: timeUtils.emptyDate },

      asrt: { type: Date, default: timeUtils.emptyDate },
      aort: { type: Date, default: timeUtils.emptyDate },

      asat: { type: Date, default: timeUtils.emptyDate },
      aobt: { type: Date, default: timeUtils.emptyDate },

      delay: { type: Number, default: 0 },
      prio: { type: Number, default: 0 },

      sug: { type: Date, default: timeUtils.emptyDate },
      pbg: { type: Date, default: timeUtils.emptyDate },
      txg: { type: Date, default: timeUtils.emptyDate },

      taxizone: { type: String, default: '' },
      taxizoneIsTaxiout: { type: Boolean, default: true },

      blockAssignment: { type: Date, default: () => new Date() },
      blockId: { type: Number, default: -1 },
      block_rwy_designator: { type: String, default: '' },
    },

    flightplan: {
      flight_rules: { type: String, default: '' },

      departure: { type: String, default: '' },
      arrival: { type: String, default: '' },
    },

    clearance: {
      dep_rwy: { type: String, default: '' },
      sid: { type: String, default: '' },
      initial_climb: { type: String, default: '' },
      assigned_squawk: { type: String, default: '' },
      current_squawk: { type: String, default: '' },
    },
    measures: [String],
    inactive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<PilotDocument>('Pilot', pilotSchema);
