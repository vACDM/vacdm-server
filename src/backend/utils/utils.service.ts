import crypto from 'node:crypto';
import fs from 'node:fs';

import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import peggy, { Parser } from 'peggy';

import logger from '../logger';

@Injectable()
export class UtilsService {
  static scopeCoordsRegex = /^(.)(\d{0,3})\.(\d{0,2})\.(\d{0,2})\.(\d{0,3}):(.)(\d{0,3})\.(\d{0,2})\.(\d{0,2})\.(\d{0,3})$/;

  convertScopeCoordsToLatLonPair(scopeCoords: string): [number, number] {
    const result = UtilsService.scopeCoordsRegex.exec(scopeCoords);
  
    if (result == null) {
      throw new Error('given coords do not match the necessary pattern');
    }
  
    const [
      ,
      latSpace,
      latDeg,
      latMin,
      latSec,
      latDecSec,
      lonSpace,
      lonDeg,
      lonMin,
      lonSec,
      lonDecSec,
    ] = result;
  
    let latDecDeg = Number(latDeg) + Number(latMin) / 60;
    latDecDeg += Number(latSec) / (60 * 60);
    latDecDeg += Number(latDecSec) / (60 * 60 * 1000);
    latDecDeg *= latSpace == 'N' ? 1 : -1;
  
    let lonDecDeg = Number(lonDeg) + Number(lonMin) / 60;
    lonDecDeg += Number(lonSec) / (60 * 60);
    lonDecDeg += Number(lonDecSec) / (60 * 60 * 1000);
    lonDecDeg *= lonSpace == 'E' ? 1 : -1;
  
    return [latDecDeg, lonDecDeg];
  }

  convertScopeCoordsToLatLonPairs(coords: string[]): [number, number][] {
    return coords.map(this.convertScopeCoordsToLatLonPair);
  }

  getDiffOps(
    nestedObject: object | number | boolean | string | unknown[] | null,
    ownKey: string[] = [],
    current: object = {},
  ) {
    if (
      ['number', 'boolean', 'string'].includes(typeof nestedObject) ||
      Array.isArray(nestedObject) ||
      nestedObject == null
    ) {
      current[ownKey.join('.')] = nestedObject;
      return current;
    }
  
    Object.entries(nestedObject).forEach(([key, value]) => {
      current = this.getDiffOps(
        value,
        [...ownKey, key],
        current,
      );
    });
  
    return current;
  }

  isTimeEmpty(date: Date): boolean {
    return date.valueOf() === -1;
  }

  addMinutes(date: Date, minutes: number): Date {
    const dateNew = new Date(date);
  
    dateNew.setUTCMinutes(date.getUTCMinutes() + minutes);
  
    return dateNew;
  }

  emptyDate = new Date(-1);

  getBlockFromTime(hhmm: Date): number {
    const hh = hhmm.getUTCHours();
    const mm = hhmm.getUTCMinutes();
  
    const block = (Number(hh) * 60 + Number(mm)) / 10;
  
    return Math.floor(block);
  }

  getTimeFromBlock(blockId: number): Date {
    if (blockId > 143) {
      logger.warn('tried to get time from block > 143: %d', blockId);
    }
  
    const minutes = blockId * 10;
    const hour = Math.floor(minutes / 60);
    const minutesInHour = minutes % 60;
  
    const plausibleDate = new Date();
    plausibleDate.setUTCHours(hour);
    plausibleDate.setUTCMinutes(minutesInHour);
  
    return plausibleDate;
  }

  generateRandomBytes(length = 32, encoding: BufferEncoding = 'base64') {
    return crypto.randomBytes(length).toString(encoding);
  }

  generateFilter(fieldMapping = {}, disallowUndefinedFieldNames = false): Parser {
    const baseFilter = fs.readFileSync('assets/filter.peggy', { encoding: 'utf8' });

    if (Object.values(fieldMapping).length == 0 && disallowUndefinedFieldNames) {
      return peggy.generate(baseFilter);
    }

    const lines = baseFilter.replace(/\r\n/gm, '\n').split('\n');
    let line = -1;
    let prefix = '';

    // find line to replace
    for (let i = 0; i < lines.length; i++) {
      const lstring = lines[i];
      if (lstring.includes('PLACEHOLDER_REPLACE_THIS_LINE')) {
        line = i;
        const match = lstring.match(/([ \t]+)[\w\W\d ]*/i);

        if (match) {
          prefix = match[1];
        }

        break;
      }
    }

    if (line == -1) {
      return peggy.generate(baseFilter);
    }

    const fieldsLines = Object.entries(fieldMapping)
      .map(([k, v]) => `${prefix}case '${k}': return '${v}'`);

    if (disallowUndefinedFieldNames) {
      fieldsLines.push(`${prefix}default: throw new Error('"' + s + '" is not an accepted field name');`);
    } else {
      fieldsLines.push(`${prefix}default: return s;`);
    }

    lines.splice(line, 1, ...fieldsLines);

    const newFilter = lines.join('\n');

    return peggy.generate(newFilter);
  }

  formatDateForHeader(date: Date | void): string {
    return dayjs(date ?? new Date()).toString();
  }
}
