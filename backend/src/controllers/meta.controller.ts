import { Request, Response } from 'express';
import fs from 'fs';

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
  let packageJson = JSON.parse(packageString.toString());

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

export function getConfig(req: Request, res: Response) {
  res.json(config().pluginSettings);
}

export default {
  getVersion,
  getConfig,
};
