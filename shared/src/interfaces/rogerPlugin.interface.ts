export interface RogerPlugin {
  MDI: RogerPluginMeasure[];
}

export interface RogerPluginMeasure {
  TIME: number;
  DEPA: string;
  DEST: string;
  VALIDDATE: string;
  VALIDTIME: string;
  MESSAGE: string;
}
