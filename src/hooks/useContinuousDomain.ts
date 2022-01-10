import { useMemo } from 'react';
import { max, min } from 'd3-array';
import { identity, isNil } from 'lodash-es';

// The domain will not be recalculated if you only change the accessor.
// This means the accessor function does not need to be referentially stable.
export function useContinuousDomain<Datum>(
  data: readonly Datum[],
  accessor: (d: Datum) => number = identity,
  options?: { includeZeroInDomain?: boolean }
): readonly number[] {
  const { includeZeroInDomain } = options ?? {};
  return useMemo(() => {
    let minValue = min(data, accessor) ?? 0;
    let maxValue = max(data, accessor) ?? 0;
    if (isNil(minValue) || isNil(maxValue)) {
      return [];
    }
    if (includeZeroInDomain) {
      if (minValue > 0) {
        minValue = 0;
      } else if (maxValue < 0) {
        maxValue = 0;
      }
    }
    return [minValue, maxValue] as const;
    // Deliberately ignore accessor in useMemo deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, includeZeroInDomain]);
}
