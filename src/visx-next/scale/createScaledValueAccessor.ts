import { AxisScale } from '@visx/axis';
import { ScaleInput } from '@visx/scale';

import { isValidNumber } from '../types/typeguards/isValidNumber';

import { getScaleBandwidth } from './getScaleBandwidth';

/** Returns a function that takes a Datum as input and returns a scaled value, correcting for the scale's bandwidth if applicable. */
export function createScaledValueAccessor<Scale extends AxisScale, Datum>(
  scale: Scale,
  accessor: (d: Datum) => ScaleInput<Scale>,
  align: 'start' | 'center' | 'end' = 'center'
) {
  return (d: Datum) => {
    const scaledValue = scale(accessor(d));
    if (isValidNumber(scaledValue)) {
      const bandwidthOffset =
        (align === 'start' ? 0 : getScaleBandwidth(scale)) / (align === 'center' ? 2 : 1);
      return scaledValue + bandwidthOffset;
    }
    return NaN;
  };
}
