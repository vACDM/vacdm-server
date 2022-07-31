export function getValidUpdateOpsFromNestedObject(
  nestedObject: Object | number | boolean | string | any[] | null,
  ownKey: string[] = [],
  current: Object = {}
) {
  if (
    ['number', 'boolean', 'string'].includes(typeof nestedObject) ||
    Array.isArray(nestedObject) ||
    nestedObject == null
  ) {
    current[ownKey.join('.')] = nestedObject;
    return current;
  }

  Object.entries(nestedObject).forEach(([key, value]) => {
    current = getValidUpdateOpsFromNestedObject(
      value,
      [...ownKey, key],
      current
    );
  });

  return current;
}

export default {
  getValidUpdateOpsFromNestedObject,
};
