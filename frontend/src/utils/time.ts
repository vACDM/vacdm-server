import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

function formatTime(inputTime: Date | undefined) {
  if (!inputTime || dayjs(inputTime).unix() === -1) {
    return "-";
  }
  return dayjs(inputTime).utc().format("HH:mm");
}

function calculateVdgsDiff(time: Date | undefined) {
  let now: any = dayjs().second(0);
  let tsat: any = dayjs(time).unix();
  let diff = now.diff(time, "minutes");
  if (tsat === -1) {
    return "WAIT FOR TSAT";
  } else if (diff > 0) {
    return "+" + diff;
  }
  return diff;
}

function flowTimeFormat (time: Date | undefined) {
  return dayjs(time).utc().format('dddd, DD.MM.YYYY HH:mm UTC')
}

export default {
  formatTime,
  calculateVdgsDiff,
  flowTimeFormat
};
