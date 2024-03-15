import mongoose, { HydratedDocument, Model } from 'mongoose';
import ms from 'ms';

import { DB_PROVIDER } from '../database.module';

import PluginToken from '@/shared/interfaces/plugin-token.interface';

export const PLUGINTOKEN_MODEL = 'PLUGINTOKEN_MODEL';
export type PluginTokenModel = Model<PluginToken>;
export type PluginTokenDocument = HydratedDocument<PluginToken>;

const PluginTokenSchema = new mongoose.Schema<PluginToken>({
  user: { type: String },
  label: { type: String, default: 'New token' },
  pollingSecret: { type: String, required: true },
  token: { type: String, required: true },
  lastUsed: { type: Date, default: Date.now },
}, { timestamps: true });

PluginTokenSchema.index({ lastUsed: 1 }, { expireAfterSeconds: ms('30d') / 1000 });

export const PluginTokenProvider = {
  provide: PLUGINTOKEN_MODEL,
  useFactory: (connection: typeof mongoose) => connection.model('PluginToken', PluginTokenSchema),
  inject: [DB_PROVIDER],
};
