import {
  EcfmpFilter,
  EcfmpMeasure,
  EcfmpPlugin,
} from "@shared/interfaces/ecfmp.interface";
import ecfmpModel, { EcfmpMeasureDocument } from "../models/measure.model";
import axios from "axios";
import pilotService from "./pilot.service";
import Pilot from "@shared/interfaces/pilot.interface";

const dummyMeasure: EcfmpMeasure[] = [
  {
    id: 10,
    ident: "EGTT25B",
    event_id: 44,
    reason: "Due runway capacity",
    starttime: "2022-04-18T13:15:30Z",
    endtime: "2022-04-18T13:15:30Z",
    withdrawn_at: "",
    notified_flight_information_regions: [1, 2, 42],
    measure: {
      type: "minimum_departure_interval",
      value: 120,
    },
    filters: [
      {
        type: "ADEP",
        value: ["EGKK", "EGLL", "EGSS"],
      },
      {
        type: "ADES",
        value: ["EH**"],
      },
      {
        type: "level",
        value: [230, 240],
      },
    ],
  },
];

export async function getAllMeasures() {
  try {
    const measures: EcfmpMeasureDocument[] = await ecfmpModel.find().exec();

    return measures;
    //return measures.data;
  } catch (error) {
    throw error;
  }
}

export async function getEcfmpDetails() {
  try {
    const ecfmpDetails = await axios.get<EcfmpPlugin>(
      "https://ecfmp.vatsim.net/api/v1/plugin"
    );

    const measures: EcfmpMeasure[] = dummyMeasure.filter(
      (measure) =>
        measure.measure.type === "minimum_departure_interval" &&
        measure.withdrawn_at !== null
    );

    measures.forEach(async (measure: EcfmpMeasure) => {
      const measureExists = await doesMeasureExist(measure.ident);
      if (measureExists) {
        await ecfmpModel
          .findOneAndUpdate({ ident: measure.ident }, measure)
          .exec();
      } else {
        const ecfmpMeasureDocument: EcfmpMeasureDocument = new ecfmpModel(
          measure
        );

        await ecfmpMeasureDocument.save();
      }
    });
  } catch (error) {
    throw error;
  }
}

export async function allocateMeasuresToPilots() {
  const pilots: Pilot[] = await pilotService.getAllPilots();
  const measures: EcfmpMeasureDocument[] = await getAllMeasures();

  pilots.forEach((pilot: Pilot) => {
    measures.forEach(async (measure: EcfmpMeasureDocument) => {
      if (await checkFilters(pilot, measure)) {
        console.log("Measure is valid for Pilot", pilot.callsign);
      }
    });
  });
}

async function checkFilters(pilot: Pilot, measure: EcfmpMeasureDocument) {
  let returnArray: Boolean[] = [];

  measure.filters.forEach((filter: EcfmpFilter) => {
    switch (filter.type) {
      case "ADEP":
        let adepArray: Boolean[] = [];
        filter.value.forEach((element) => {
          let niceElement = element.replace(/\*/g, ".");
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

      case "ADES":
        let adesArray: Boolean[] = [];
        filter.value.forEach((element) => {
          let niceElement = element.replace(/\*/g, ".");
          const re = new RegExp(`${niceElement}`);

          if (re.test(pilot.flightplan.arrival)) {
            adesArray.push(true);
          } else {
            adesArray.push(false);
          }
        });
        console.log("ades", adesArray);

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

  console.log("return", returnArray);

  if (returnArray.every(Boolean)) {
    return true;
  }

  return false;
}

export async function doesMeasureExist(ident: string): Promise<boolean> {
  try {
    const count = await ecfmpModel.count({ ident }).exec();

    return count > 0;
  } catch (e) {
    throw e;
  }
}

export default { getAllMeasures, getEcfmpDetails, allocateMeasuresToPilots };
