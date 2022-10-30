import axios from "axios";
import timeUtils from "../utils/time";

export async function updateTobt(time: string, callsign: string | undefined) {
  try {
    await axios.patch("/api/v1/vdgs/" + callsign, {
      "vacdm.tobt": timeUtils.formatVdgsTobt(time),
      "vacdm.ttot": -1,
      "vacdm.tsat": -1,
      "vacdm.tobt_state": "CONFIRMED"
    }, {
      withCredentials: true
    });

    return;
  } catch (error) {
    throw error;
  }
}

export default { updateTobt };
