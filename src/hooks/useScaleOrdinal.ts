import { useMemo } from 'react';
import { scaleOrdinal } from 'd3-scale';

import type { DomainValue } from '@/types';

// The domain and range need to be stable.
export function useScaleOrdinal<CategoryT extends { toString(): string }, ValueT extends DomainValue>(
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
