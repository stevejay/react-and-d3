import { getScaleBandwidth } from './getScaleBandwidth';
import { isValidNumber } from './isValidNumber';
import type { AxisScale, ScaleInput } from './types';

/** Returns a function that takes a Datum as input and returns a scaled value, correcting for the scale's bandwidth if applicable. */
export function getScaledValueFactory<Scale extends AxisScale, Datum>(
  scale: Scale,
  accessor: (d: Datum) => ScaleInput<Scale>,
  align: 'start' | 'center' | 'end' = 'center'
) {
  return (datum: Datum) => {
    const scaledValue = scale(accessor(datum));
    if (isValidNumber(scaledValue)) {
      const bandwidthOffset =
        (align === 'start' ? 0 : getScaleBandwidth(scale)) / (align === 'center' ? 2 : 1); // TODO change to multiply.
      return scaledValue + bandwidthOffset;
    }
    return NaN;
  };
}
