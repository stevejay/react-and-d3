import { useMemo } from 'react';
import * as d3 from 'd3';
import { identity } from 'lodash-es';

export function useTimeDomain<Datum>(
  data: Datum[],
  accessor: (d: Datum) => Date = identity
): readonly [Date, Date] {
  return useMemo(() => {
    let min = d3.min(data, accessor) as Date; // TODO what does d3 scale do in this case?
    let max = d3.max(data, accessor) as Date; // TODO what does d3 scale do in this case?
    return [min, max] as const;
    // Deliberately ignore accessor in useMemo deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
}
