import { useMemo } from 'react';
import { scaleIdentity } from 'd3-scale';

import type { AxisScale } from '@/types';

// The domain and range need to be stable. The options object does not need to be stable.
export function useIdentityScale(
  domain: readonly number[],
  range: readonly number[],
  options?: { nice?: boolean; unknown?: number; ticks?: number }
): AxisScale<number> {
  const { nice, unknown = undefined, ticks } = options ?? {};
  return useMemo<AxisScale<number>>(() => {
    const scale = scaleIdentity();
    scale.domain(domain);
    scale.range(range);
    scale.unknown(unknown);
    scale.ticks(ticks ?? 10);
    // Nice-ing must happen after setting the domain, so just always set it last.
    nice && scale.nice();
    return scale;
  }, [domain, range, nice, unknown, ticks]);
}
