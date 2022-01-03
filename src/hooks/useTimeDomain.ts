import { useMemo } from 'react';
import { max, min } from 'd3';
import { identity, isNil } from 'lodash-es';

// The domain will not be recalculated if you only change the accessor.
// This means the accessor function does not need to be stable.
export function useTimeDomain<Datum>(
  data: Datum[],
  accessor: (d: Datum) => Date = identity
): readonly Date[] {
  return useMemo(() => {
    let minValue = min(data, accessor);
    let maxValue = max(data, accessor);
    return isNil(minValue) || isNil(maxValue) ? [] : [minValue, maxValue];
    // Deliberately ignore accessor in useMemo deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
}
