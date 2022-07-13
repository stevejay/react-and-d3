import { useMemo } from 'react';
import { max, min } from 'd3-array';
import { identity, isNil } from 'lodash-es';

// The domain will not be recalculated if you only change the accessor.
// This means the accessor function does not need to be referentially stable.
export function useTimeDomain<Datum>(
  data: Datum[],
  accessor: (datum: Datum) => Date = identity
): readonly Date[] {
  return useMemo(() => {
    const minValue = min(data, accessor);
    const maxValue = max(data, accessor);
    return isNil(minValue) || isNil(maxValue) ? [] : [minValue, maxValue];
    // Deliberately ignore accessor in useMemo deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
}
