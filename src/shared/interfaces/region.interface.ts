export interface Region {
  label: string;
  identifier: string;

  airportPatterns: string[];

  parent?: string;
}
