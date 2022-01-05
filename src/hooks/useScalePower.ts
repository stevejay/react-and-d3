import { useMemo } from 'react';
import { interpolate, interpolateRound } from 'd3-interpolate';
import { scalePow } from 'd3-scale';

// The domain and range need to be stable. The options object does not need to be stable.
export function useScalePower(
  domain: readonly number[],
  range: readonly number[],
  options?: {
    nice?: boolean;
    rangeRound?: boolean;
    clamp?: boolean;
    unknown?: number;
    ticks?: number;
    exponent?: number;
  }
) {
  const { nice, rangeRound = false, clamp = false, unknown = undefined, ticks, exponent = 1 } = options ?? {};
  return useMemo(() => {
    const scale = scalePow();
    scale.domain(domain);
    scale.range(range);
    scale.interpolate(rangeRound ? interpolateRound : interpolate);
    scale.clamp(clamp);
    scale.unknown(unknown);
    scale.ticks(ticks ?? 10);
    scale.exponent(exponent);
    // Nice-ing must happen after setting the domain, so just always set it last.
    nice && scale.nice();
    return scale;
  }, [domain, range, nice, rangeRound, clamp, unknown, ticks, exponent]);
}
