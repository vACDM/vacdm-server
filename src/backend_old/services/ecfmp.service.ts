import axios from 'axios';
import dayjs from 'dayjs';

import ecfmpModel, { EcfmpMeasureDocument } from '../models/measure.model';
import { PilotDocument } from '../models/pilot.model';

import pilotService from './pilot.service';

import {
  EcfmpFilter,
  EcfmpMeasure,
  EcfmpPlugin,
} from '@/shared/interfaces/ecfmp.interface';
import Pilot from '@/shared/interfaces/pilot.interface';

export async function getAllMeasures() {
  try {
    const measures: EcfmpMeasureDocument[] = await ecfmpModel.find().exec();

    return measures;
    //return measures.data;
  } catch (e) {
    console.log('error getting all measures', e);
    throw e;
  }
}

export async function doesMeasureExist(ident: string): Promise<boolean> {
  try {
    const count = await ecfmpModel.count({ ident }).exec();

    return count > 0;
  } catch (e) {
    console.log('error checking if measure exists', e);
    throw e;
  }
}

export async function getEcfmpDetails() {
  try {
    const ecfmpDetails = await axios.get<EcfmpPlugin>(
      'https://ecfmp.vatsim.net/api/v1/plugin',
    );

    const measures: EcfmpMeasure[] = ecfmpDetails.data.flow_measures.filter(
      (measure) => measure.measure.type === 'minimum_departure_interval',
    );

    measures.forEach(async (measure: EcfmpMeasure) => {
      console.log(measure.starttime);

      const measureExists = await doesMeasureExist(measure.ident);
      if (measureExists) {
        await ecfmpModel
          .findOneAndUpdate({ ident: measure.ident }, measure)
          .exec();
      } else {
        const ecfmpMeasureDocument: EcfmpMeasureDocument = new ecfmpModel(
          measure,
        );

        await ecfmpMeasureDocument.save();
      }
    });
  // eslint-disable-next-line no-useless-catch
  } catch (error) {
    throw error;
  } finally {
    const measures: EcfmpMeasureDocument[] = await getAllMeasures();

    const oldMeasures = measures
      .filter(
        (measure) =>
          dayjs(measure.withdrawn_at).isBefore(new Date()) ||
          dayjs(measure.endtime).isBefore(new Date()),
      )
      .map((e) => e._id);

    await ecfmpModel.deleteMany({ _id: { $in: oldMeasures } }).exec();
  }
}

export async function removeMeasuresFromPilots() {
  try {
    const pilots: PilotDocument[] = await pilotService.getAllPilots();
    const measures: EcfmpMeasureDocument[] = await getAllMeasures();

    const measureIdentifiers: string[] = measures.map((m) => m.ident);

    for (const pilot of pilots) {
      const validMeasures = pilot.measures.filter((pilotMeasure) =>
        measureIdentifiers.includes(pilotMeasure.ident),
      );

      pilot.measures = validMeasures;

      await pilot.save();

      /* for (const measure of pilot.measures) {
        if (measureIdentifiers.includes(measure.ident)) {
          await pilotService.addLog({
            pilot: pilot.callsign,
            namespace: "ecfmp",
            action: "Measure Cancellation",
            data: {
              measure: measure.ident,
            },
          });
        }
      } */
    }
  } catch (e) {
    console.log('error removing measures from pilots', e);
    throw e;
  }
}

async function isMeasureValidForPilot(
  pilot: Pilot,
  measure: EcfmpMeasureDocument,
) {
  const returnArray: boolean[] = [];

  measure.filters.forEach((filter: EcfmpFilter) => {
    switch (filter.type) {
      case 'ADEP':
        // eslint-disable-next-line no-case-declarations
        const adepArray: boolean[] = [];

        filter.value.forEach((element) => {
          const niceElement = element.replace(/\*/g, '.');
          const re = new RegExp(`${niceElement}`);

          if (re.test(pilot.flightplan.departure)) {
            adepArray.push(true);
          } else {
            adepArray.push(false);
          }
        });
        if (adepArray.some(Boolean)) {
          returnArray.push(true);
        } else {
          returnArray.push(false);
        }
        break;

      case 'ADES':
        // eslint-disable-next-line no-case-declarations
        const adesArray: boolean[] = [];

        filter.value.forEach((element) => {
          const niceElement = element.replace(/\*/g, '.');
          const re = new RegExp(`${niceElement}`);

          if (re.test(pilot.flightplan.arrival)) {
            adesArray.push(true);
          } else {
            adesArray.push(false);
          }
        });

        if (adesArray.some(Boolean)) {
          returnArray.push(true);
        } else {
          returnArray.push(false);
        }

        break;

      // remove default when every case is catched
      default:
        returnArray.push(true);
        break;
    }
  });

  if (returnArray.every(Boolean)) {
    return true;
  }

  return false;
}

export async function allocateMeasuresToPilots() {
  try {
    await removeMeasuresFromPilots();
    const pilots: PilotDocument[] = await pilotService.getAllPilots();
    const measures: EcfmpMeasureDocument[] = await getAllMeasures();

    pilots.forEach(async (pilot: PilotDocument) => {
      measures.forEach(async (measure: EcfmpMeasureDocument) => {
        if (
          dayjs(measure.starttime).isBefore(new Date(pilot.vacdm.ttot)) &&
          dayjs(measure.endtime).isAfter(new Date(pilot.vacdm.ttot)) &&
          (await isMeasureValidForPilot(pilot, measure)) &&
          measure.enabled
        ) {
          if (!pilot.measures.find((e) => e.ident === measure.ident)) {
            pilot.measures.push({
              ident: measure.ident,
              value: measure.measure.value,
            });

            await pilot.save();

            await pilotService.addLog({
              pilot: pilot.callsign,
              namespace: 'ecfmp',
              action: 'Measure Allocation',
              data: {
                measure: measure.ident,
              },
            });
          }
        }
      });
    });
  } catch (e) {
    console.log('error allocating measures to pilots', e);
    throw e;
  }
}

export async function editMeasure(measureId: number, measure: EcfmpMeasureDocument) {
  try {
    const updatedMeasure = await ecfmpModel.findOneAndUpdate(
      { id: measureId },
      { enabled: measure.enabled },
      { new: true },
    ).exec();

    return updatedMeasure;
  } catch (e) {
    console.log('error editing measure', e);
    throw e;
  }
}

export default { getAllMeasures, getEcfmpDetails, allocateMeasuresToPilots, editMeasure };
