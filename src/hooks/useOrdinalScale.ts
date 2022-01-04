import { useMemo } from 'react';
import type { AxisDomain } from 'd3-axis';
import { scaleOrdinal } from 'd3-scale';

export function useOrdinalScale<CategoryT extends { toString(): string }, ValueT extends AxisDomain>(
  domain: readonly CategoryT[],
  range: readonly ValueT[]
) {
  return useMemo(() => {
    const scale = scaleOrdinal<CategoryT, ValueT>();
    scale.domain(domain);
    scale.range(range);
    return scale;
  }, [domain, range]);
}
