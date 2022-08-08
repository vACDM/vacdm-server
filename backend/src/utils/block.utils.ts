export function getBlockFromTime(hhmm: Date): number {
  const hh = hhmm.getUTCHours();
  const mm = hhmm.getUTCMinutes();

  const block = (Number(hh) * 60 + Number(mm)) / 10;

  return Math.floor(block);
}

export function getTimeFromBlock(blockId: number): Date {
  if (blockId > 143) {
    console.log('tried to get time from block > 143', blockId);
  }

  const minutes = blockId * 10;
  const hour = Math.floor(minutes / 60);
  const minutesInHour = minutes % 60;

  const plausibleDate = new Date();
  plausibleDate.setUTCHours(hour);
  plausibleDate.setUTCMinutes(minutesInHour);

  return plausibleDate;
}

export default {
  getBlockFromTime,
  getTimeFromBlock,
};
