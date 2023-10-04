import fs from 'fs';

import { Request, Response } from 'express';

import config from '../config';

const packageString = fs.readFileSync('./package.json');
let versionResponse = {
  version: '',
  major: -1,
  minor: -1,
  patch: -1,
  prerelease: '',
};
if (packageString) {
  const packageJson = JSON.parse(packageString.toString());

  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
  const [version, major, minor, patch, _, prerelease] =
    /(\d).(\d).(\d)(-(.*))?/gi.exec(packageJson.version) as string[];

  versionResponse = {
    version,
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease: prerelease ?? '',
  };
}

export function getVersion(req: Request, res: Response) {
  res.json(versionResponse);
}

export function getPluginConfig(req: Request, res: Response) {
  res.json(config().pluginSettings);
}

export function getFrontendConfig(req: Request, res: Response) {
  res.json(config().frontendSettings);
}

export default {
  getVersion,
  getPluginConfig,
  getFrontendConfig,
};
