import { useMemo } from 'react';
import { scaleBand } from 'd3-scale';

import type { DomainValue } from '@/types';

// The domain and range need to be stable. The options object does not need to be stable.
// paddingInner: the proportion of the range that is reserved for blank space between bands.
// 0 means no blank space between bands; 1 means a bandwidth of zero.
// paddingOuter: the amount of blank space, in terms of multiples of the step,
// to reserve before the first band and after the last band.
// rangeRound: If true, the start and stop of each band will be integers.
export function useScaleBand<CategoryT extends DomainValue>(
  domain: readonly CategoryT[],
  range: readonly number[],
  options?: { paddingInner?: number; paddingOuter?: number; rangeRound?: boolean; align?: number }
) {
  const { paddingInner = 0, paddingOuter = 0, rangeRound = false, align = 0.5 } = options ?? {};
  return useMemo(() => {
    const scale = scaleBand<CategoryT>();
    scale.domain(domain);
    scale.range(range);
    scale.paddingInner(paddingInner);
    scale.paddingOuter(paddingOuter);
    scale.round(rangeRound);
    scale.align(align);
    return scale;
  }, [domain, range, paddingInner, paddingOuter, rangeRound, align]);
}
