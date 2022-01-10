import { useMemo } from 'react';
import { interpolate, interpolateRound } from 'd3-interpolate';
import { scaleLog } from 'd3-scale';

// The domain and range need to be referentially stable. The options object does
// not need to be referentially stable.
export function useLogScale(
  domain: readonly number[],
  range: readonly number[],
  options?: {
    nice?: boolean;
    rangeRound?: boolean;
    clamp?: boolean;
    unknown?: number;
    ticks?: number;
    base?: number;
  }
) {
  const { nice, rangeRound = false, clamp = false, unknown = undefined, ticks, base = 10 } = options ?? {};
  return useMemo(() => {
    const scale = scaleLog();
    scale.domain(domain);
    scale.range(range);
    scale.interpolate(rangeRound ? interpolateRound : interpolate);
    scale.clamp(clamp);
    scale.unknown(unknown);
    scale.ticks(ticks ?? 10);
    scale.base(base);
    // Nice-ing must happen after setting the domain, so just always set it last.
    nice && scale.nice();
    return scale;
  }, [domain, range, nice, rangeRound, clamp, unknown, ticks, base]);
}
