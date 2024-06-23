import { Inject, Injectable } from '@nestjs/common';
import Agenda from 'agenda';
import axios from 'axios';
import dayjs from 'dayjs';

import { EcfmpMeasure, EcfmpPlugin } from '../../shared/interfaces/ecfmp.interface';
import logger from '../logger';
import { AGENDA_PROVIDER } from '../schedule.module';

import { ECFMP_MEASURE_MODEL, EcfmpMeasureDocument, EcfmpMeasureModel } from './ecfmp-measure.model';



@Injectable()
export class EcfmpService {
  constructor(
    @Inject(ECFMP_MEASURE_MODEL) private ecfmpMeasureModel: EcfmpMeasureModel,
    @Inject(AGENDA_PROVIDER) private agenda: Agenda,
  ) {
    this.agenda.define('ECFMP_processEcfmpMeasures', this.processMeasures.bind(this));
    this.agenda.every('1 minute', 'ECFMP_processEcfmpMeasures');
  }

  async getEcfmpMeasures(): Promise<EcfmpMeasure[]> {
    //TODO: replace dev url
    const ecfmpUrl = 'https://flow-dev.ecfmp.net/api/v1/plugin';

    try {
      const ecfmpMeasures = await axios.get<EcfmpPlugin>(ecfmpUrl);

      return ecfmpMeasures.data.flow_measures;

    } catch (error) {
      logger.error('Error on retrieving Measures from ECFMP %o', error);
      throw error; 
    }  
  }

  async getInternalMeasures(): Promise<EcfmpMeasureDocument[]> {
    return this.ecfmpMeasureModel.find({}).exec();
  }

  async upsertMeasure(data: EcfmpMeasure): Promise<EcfmpMeasureDocument> {
    const measure = await this.ecfmpMeasureModel.findOneAndUpdate({
      ident: data.ident,
    }, {
      $set: {
        id: data.id,
        event_id: data.event_id,
        reason: data.reason,
        starttime: data.starttime,
        measure: data.measure,
        filters: data.filters,
        endtime: data.endtime,
        notified_flight_information_regions: data.notified_flight_information_regions,
        withdrawn_at: data.withdrawn_at,
      },
    }, {
      new: true,
      upsert: true,
    });

    return measure;
  }

  async removeOldMeasures() {
    const measures = await this.getInternalMeasures();

    const oldMeasures = measures
      .filter(
        (measure) =>
          dayjs(measure.withdrawn_at).isBefore(new Date()) ||
          dayjs(measure.endtime).isBefore(new Date()),
      )
      .map((e) => e._id);

    await this.ecfmpMeasureModel.deleteMany({ _id: { $in: oldMeasures } }).exec();

    logger.debug('Removed Measures %j', oldMeasures);
  }

  async processMeasures() {
    logger.debug('Process Measures');
    const measures = await this.getEcfmpMeasures();

    const filteredMeasures = measures.filter(
      (measure) => measure.measure.type === 'minimum_departure_interval' ||
                    measure.measure.type === 'average_departure_interval' ||
                    measure.measure.type === 'prohibit' ||
                    measure.measure.type === 'mandatory_route');

    for (const measure of filteredMeasures) {
      await this.upsertMeasure(measure);
    }


    await this.removeOldMeasures();

  }

}


