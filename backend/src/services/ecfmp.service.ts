import { EcfmpMeasure } from "@shared/interfaces/ecfmp.interface";
import axios from "axios";


const dummyMeasure = {
          id: 10,
          ident: "EGTT25B",
          event_id: 44,
          reason: "Due runway capacity",
          starttime: "2022-04-18T13:15:30Z",
          endtime: "2022-04-18T13:15:30Z",
          notified_flight_information_regions: [
            1,
            2,
            42
          ],
          measure: {
            type: "minimum_departure_interval",
            value: 120
          },
          filters: [
            {
              type: "ADEP",
              value: [
                "EGKK",
                "EGLL",
                "EGSS"
              ]
            },
            {
              type: "ADES",
              value: [
                "EH**"
              ]
            },
            {
              type: "level",
              value: [
                230,
                240
              ]
            }
          ]
}

export async function getAllMeasures(): Promise<EcfmpMeasure[]> {
  try {
    const measures = await axios.get<EcfmpMeasure[]>(
      "https://ecfmp.vatsim.net/api/v1/flow-measure"
    );
    console.log(measures.data);

    return [dummyMeasure];
    //return measures.data;
  } catch (error) {
    throw error;
  }
}

export default {getAllMeasures};
