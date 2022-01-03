import { useMemo } from 'react';
import type { AxisDomain, AxisScale } from 'd3-axis';
import { scalePoint } from 'd3-scale';

// The domain and range need to be stable. The options object does not need to be stable.
// padding: specifies the amount of blank space, in terms of multiples of the step,
// to reserve before the first point and after the last point.
// rangeRound: If true, the start and stop of each band will be integers.
export function usePointScale<CategoryT extends AxisDomain>(
  domain: readonly CategoryT[],
  range: readonly number[],
  options?: { padding?: number; rangeRound?: boolean; align?: number }
): AxisScale<CategoryT> {
  const { padding = 0, rangeRound = false, align = 0.5 } = options ?? {};
  return useMemo<AxisScale<CategoryT>>(() => {
    const scale = scalePoint<CategoryT>();
    scale.domain(domain);
    scale.range(range);
    scale.padding(padding);
    scale.round(rangeRound);
    scale.align(align);
    return scale;
  }, [domain, range, padding, rangeRound, align]);
}
