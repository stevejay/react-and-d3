import { useMemo } from 'react';
import type { AxisDomain } from 'd3-axis';
import { identity } from 'lodash-es';

// The domain will not be recalculated if you only change the accessor.
// This means the accessor function does not need to be stable.
export function useOrdinalDomain<Datum, CategoryT extends AxisDomain>(
  data: readonly Datum[],
  accessor: (d: Datum) => CategoryT = identity
): readonly CategoryT[] {
  // Deliberately ignore accessor in useMemo deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => data.map(accessor), [data]);
}
