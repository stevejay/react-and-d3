import { useMemo } from 'react';
import { interpolate, interpolateRound } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';

// The domain and range need to be referentially stable. The options object does
// not need to be referentially stable.
export function useLinearScale(
  domain: readonly number[],
  range: readonly number[],
  options?: { nice?: boolean; rangeRound?: boolean; clamp?: boolean; unknown?: number; ticks?: number }
) {
  const { nice, rangeRound = false, clamp = false, unknown = undefined, ticks } = options ?? {};
  return useMemo(() => {
    const scale = scaleLinear();
    scale.domain(domain);
    scale.range(range);
    scale.interpolate(rangeRound ? interpolateRound : interpolate);
    scale.clamp(clamp);
    scale.unknown(unknown);
    scale.ticks(ticks ?? 10);
    // Nice-ing must happen after setting the domain, so just always set it last.
    nice && scale.nice();
    return scale;
  }, [domain, range, nice, rangeRound, clamp, unknown, ticks]);
}
