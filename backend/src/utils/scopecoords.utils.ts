export function parseAndConvertScopeCoords(scopeCoords: string) {
  const coordsRegex =
    /^(.)(\d{0,3})\.(\d{0,2})\.(\d{0,2})\.(\d{0,3}):(.)(\d{0,3})\.(\d{0,2})\.(\d{0,2})\.(\d{0,3})$/;

  const result = coordsRegex.exec(scopeCoords);

  if (result == null) {
    throw new Error('given coords do not match the necessary pattern');
  }

  let [
    fullMatch,
    latSpace,
    latDeg,
    latMin,
    latSec,
    latDecSec,
    lonSpace,
    lonDeg,
    lonMin,
    lonSec,
    lonDecSec,
  ] = result;

  let latDecDeg = Number(latDeg) + Number(latMin) / 60;
  latDecDeg += Number(latSec) / (60 * 60);
  latDecDeg += Number(latDecSec) / (60 * 60 * 1000);
  latDecDeg *= latSpace == 'N' ? 1 : -1;

  let lonDecDeg = Number(lonDeg) + Number(lonMin) / 60;
  lonDecDeg += Number(lonSec) / (60 * 60);
  lonDecDeg += Number(lonDecSec) / (60 * 60 * 1000);
  lonDecDeg *= lonSpace == 'E' ? 1 : -1;

  return [latDecDeg, lonDecDeg];
}

export default {
  parseAndConvertScopeCoords,
};
