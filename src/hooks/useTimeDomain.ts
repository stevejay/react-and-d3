import { useMemo } from 'react';
import * as d3 from 'd3';
import { identity, isNil } from 'lodash-es';

// The domain will not be recalculated if you only change the accessor.
// This means the accessor function does not need to be stable.
export function useTimeDomain<Datum>(
  data: Datum[],
  accessor: (d: Datum) => Date = identity
): readonly Date[] {
  return useMemo(() => {
    let min = d3.min(data, accessor);
    let max = d3.max(data, accessor);
    return isNil(min) || isNil(max) ? [] : [min, max];
    // Deliberately ignore accessor in useMemo deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
}
