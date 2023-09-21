export function isUndefined<T>(updateTo: T, current: T): T {
  return typeof updateTo !== 'undefined' ? updateTo : current;
}
