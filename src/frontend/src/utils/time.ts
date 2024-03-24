import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(relativeTime);

function formatTime(inputTime: Date | undefined) {
  if (!inputTime || dayjs(inputTime).unix() === -1) {
    return '-';
  }
  return dayjs(inputTime).utc().format('HH:mm');
}

function formatDateTime(date: Date | string) {
  return dayjs(date).utc().format('DD MMM YYYY HH:mm:ss[z]');
}

function calculateVdgsDiff(time: Date | undefined) {
  const now: dayjs.Dayjs = dayjs().second(0);
  const tsat: number = dayjs(time).unix();
  const diff = now.diff(time, 'minutes');
  if (tsat === -1) {
    return 'WAIT FOR TSAT';
  } else if (diff > 0) {
    return '+' + diff;
  }
  return diff;
}

function flowTimeFormat(time: string | undefined) {
  return dayjs(time).utc().format('dddd, DD.MM.YYYY HH:mm UTC');
}

function formatVdgsTobt(time: string) {
  return dayjs
    .utc()
    .set('hour', parseInt(time.substring(0, 2)))
    .set('minute', parseInt(time.substring(2)))
    .toISOString();
}

export default {
  formatTime,
  formatDateTime,
  calculateVdgsDiff,
  flowTimeFormat,
  formatVdgsTobt,
};
