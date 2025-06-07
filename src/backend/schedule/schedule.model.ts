import mongoose, { HydratedDocument, Model } from 'mongoose';

import { DB_PROVIDER } from '../database.module';

export interface ISchedule {
  id: string;
  nextRun: Date;
}

export const SCHEDULE_MODEL = 'SCHEDULE_MODEL';
export type ScheduleModel = Model<ISchedule>;
export type ScheduleDocument = HydratedDocument<ISchedule>;

const ScheduleSchema = new mongoose.Schema<ISchedule>({
  id: { type: String, required: true },
  nextRun: { type: Date, default: () => new Date() },
}, { timestamps: true });

export const ScheduleProvider = {
  provide: SCHEDULE_MODEL,
  useFactory: (connection: mongoose.Connection) => connection.model('Schedule', ScheduleSchema),
  inject: [DB_PROVIDER],
};
