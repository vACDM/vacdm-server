type DateToString<T> = {
  [k in keyof T]: T[k] extends Date | undefined
    ? string | number
    : T[k] extends object
      ? DateToString<T[k]>
      : T[k];
};

export type NestedPartial<T> = {
  [k in keyof T]?: T[k] extends object
    ? NestedPartial<T[k]>
    : T[k];
};

export type ConvertForApis<T> = DateToString<T>;
