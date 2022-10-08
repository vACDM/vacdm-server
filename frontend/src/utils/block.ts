export function getBlockFromTime(hhmm: Date): number {
    const hh = hhmm.getUTCHours();
    const mm = hhmm.getUTCMinutes();
  
    const block = (Number(hh) * 60 + Number(mm)) / 10;
  
    return Math.floor(block);
  }

  export default {
    getBlockFromTime
  };
  