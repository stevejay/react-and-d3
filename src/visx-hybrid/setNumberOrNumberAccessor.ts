/**
 * This is a workaround for TypeScript not inferring the correct
 * method overload/signature for some d3 shape methods.
 */
export function setNumberOrNumberAccessor<NumberAccessor>(
  func: (d: number | NumberAccessor) => void,
  value: number | NumberAccessor
) {
  if (typeof value === 'number') {
    func(value);
  } else {
    func(value);
  }
}
