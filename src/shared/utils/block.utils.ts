function getBlockFromTime(hhmm: Date): number {
  return Math.floor(hhmm.valueOf() / 600000);
}

function getTimeFromBlock(blockId: number): Date {
  return new Date(blockId * 600000);
}

export default {
  getBlockFromTime,
  getTimeFromBlock,
};
