export interface BeforeContextChange<T> {
  beforeContextChange: (value: T) => void;
}

export function hasBeforeContextChange<T>(
  value
): value is BeforeContextChange<T> {
  if (value.beforeContextChange) {
    return true;
  }
  return false;
}
