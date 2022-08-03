import { EcfmpMeasure } from "@shared/interfaces/ecfmp.interface";
import axios from "axios";

export async function getAllMeasures(): Promise<EcfmpMeasure[]> {
  try {
    const measures = await axios.get<EcfmpMeasure[]>(
      "https://ecfmp.vatsim.net/api/v1/flow-measure"
    );

    return measures.data;
  } catch (error) {
    throw error;
  }
}

export default { getAllMeasures };
