import { useMemo } from 'react';
import type { AxisDomain } from 'd3';
import { identity } from 'lodash-es';

export function useOrdinalDomain<Datum, CategoryT extends AxisDomain>(
  data: Datum[],
  accessor: (d: Datum) => CategoryT = identity
): readonly CategoryT[] {
  // Deliberately ignore accessor in useMemo deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => data.map(accessor), [data]);
}
