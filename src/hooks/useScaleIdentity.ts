import { useMemo } from 'react';
import { scaleIdentity } from 'd3-scale';

// The domain and range need to be stable. The options object does not need to be stable.
export function useScaleIdentity(
  domain: readonly number[],
  range: readonly number[],
  options?: { nice?: boolean; unknown?: number; ticks?: number }
) {
  const { nice, unknown = undefined, ticks } = options ?? {};
  return useMemo(() => {
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