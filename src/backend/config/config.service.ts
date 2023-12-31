import fs from 'node:fs';

import { Injectable } from '@nestjs/common';

import { AirportService } from '../airport/airport.service';
import getAppConfig from '../config';

@Injectable()
export class ConfigService {
  versionResponse = {
    version: '',
    major: -1,
    minor: -1,
    patch: -1,
    prerelease: '',
  };
  
  constructor(
    private airportService: AirportService,
  ) {
    const packageString = fs.readFileSync('./package.json');
    
    if (packageString) {
      const packageJson = JSON.parse(packageString.toString());

      // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
      const [version, major, minor, patch, _, prerelease] = /(\d).(\d).(\d)(-(.*))?/gi.exec(packageJson.version) as string[];

      this.versionResponse = {
        version,
        major: Number(major),
        minor: Number(minor),
        patch: Number(patch),
        prerelease: prerelease ?? '',
      };
    }
  }

  getVersion() {
    return this.versionResponse;
  }

  getPluginConfig() {
    return getAppConfig().pluginSettings;
  }
  
  getFrontendConfig() {
    return getAppConfig().frontendSettings;
  }

  async getExtendedPluginConfig() {
    const airports = await this.airportService.getKnownAirportIcaos();
    
    return {
      version: this.versionResponse,
      config: this.getPluginConfig(),
      supportedAirports: airports,
    };
  }
}
