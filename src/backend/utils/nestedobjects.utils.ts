export function getValidUpdateOpsFromNestedObject(
  nestedObject: object | number | boolean | string | unknown[] | null,
  ownKey: string[] = [],
  current: object = {},
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
      current,
    );
  });

  return current;
}

export default {
  getValidUpdateOpsFromNestedObject,
};
