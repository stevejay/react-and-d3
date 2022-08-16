import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { isBandScale } from './isBandScale';
import { isValidNumber } from './isValidNumber';
import type { AxisScale, ScaleInput } from './types';

/** Returns a function that takes a Datum as input and returns a scaled value, correcting for the scale's bandwidth if applicable. */
export function getScaledValueFactory<Scale extends AxisScale, Datum>(
  scale: Scale,
  accessor: (d: Datum) => ScaleInput<Scale>,
  align: 'start' | 'center' | 'end' = 'center'
) {
  return (datum: Datum) => {
    const scaledValue = coerceNumber(scale(accessor(datum)));
    if (isValidNumber(scaledValue)) {
      if (isBandScale(scale)) {
        const bandwidthOffset =
          (align === 'start' ? 0 : getScaleBandwidth(scale)) * (align === 'center' ? 0.5 : 1);
        return scaledValue + bandwidthOffset;
      } else {
        return scaledValue;
      }
    }
    return NaN;
  };
}
