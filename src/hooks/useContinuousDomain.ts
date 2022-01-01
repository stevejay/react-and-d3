import { useMemo } from 'react';
import * as d3 from 'd3';
import { identity, isNil } from 'lodash-es';

// The domain will not be recalculated if you only change the accessor.
// This means the accessor function does not need to be stable.
export function useContinuousDomain<Datum>(
  data: Datum[],
  accessor: (d: Datum) => number = identity,
  options?: { includeZeroInDomain?: boolean }
): readonly number[] {
  const { includeZeroInDomain } = options ?? {};
  return useMemo(() => {
    let min = d3.min(data, accessor) ?? 0;
    let max = d3.max(data, accessor) ?? 0;
    if (isNil(min) || isNil(max)) {
      return [];
    }
    if (includeZeroInDomain) {
      if (min > 0) {
        min = 0;
      } else if (max < 0) {
        max = 0;
      }
    }
    return [min, max] as const;
    // Deliberately ignore accessor in useMemo deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, includeZeroInDomain]);
}
