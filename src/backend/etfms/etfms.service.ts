import { Inject, Injectable } from '@nestjs/common';
import Agenda from 'agenda';

import { ECFMP_MEASURE_MODEL, EcfmpMeasureModel } from '../ecfmp/ecfmp-measure.model';
import { AGENDA_PROVIDER } from '../schedule.module';

@Injectable()
export class EtfmsService {
  constructor(
    @Inject(ECFMP_MEASURE_MODEL) private ecfmpMeasureModel: EcfmpMeasureModel,
    @Inject(AGENDA_PROVIDER) private agenda: Agenda,
  ) {
    this.agenda.define('ETFMS_assignMeasures', this.assignMeasures.bind(this));
    this.agenda.every('1 minute', 'ETFMS_assignMeasures');
  }

  async assignMeasures() {

  }


}
