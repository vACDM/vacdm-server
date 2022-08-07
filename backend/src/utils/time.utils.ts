export const emptyDateValue = -1;
export const emptyDate = new Date(emptyDateValue);

export function isTimeEmpty(date: Date): boolean {
  return date.valueOf() == emptyDateValue;
}

export function addMinutes(date: Date, minutes: number): Date {
  let dateNew = new Date(date);

  dateNew.setUTCMinutes(date.getUTCMinutes() + minutes);

  return dateNew;
}

export default {
  emptyDate,
  emptyDateValue,
  isTimeEmpty,
  addMinutes,
};
