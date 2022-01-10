import { useMemo } from 'react';
import { interpolate, interpolateRound } from 'd3-interpolate';
import { scaleTime, scaleUtc } from 'd3-scale';

// The domain and range need to be referentially stable. The options object does
// not need to be referentially stable.
// options.utc The returned time scale operates in Coordinated Universal Time
// rather than local time.
export function useTimeScale(
  domain: readonly Date[],
  range: readonly number[],
  options?: {
    nice?: boolean;
    rangeRound?: boolean;
    clamp?: boolean;
    unknown?: number;
    ticks?: number;
    utc?: boolean;
  }
) {
  const { nice, rangeRound = false, clamp = false, unknown = undefined, ticks, utc } = options ?? {};
  return useMemo(() => {
    const factory = utc ? scaleUtc : scaleTime;
    const scale = factory();
    scale.domain(domain);
    scale.range(range);
    scale.interpolate(rangeRound ? interpolateRound : interpolate);
    scale.clamp(clamp);
    scale.unknown(unknown);
    scale.ticks(ticks ?? 10);
    // Nice-ing must happen after setting the domain, so just always set it last.
    nice && scale.nice();
    return scale;
  }, [domain, range, nice, rangeRound, clamp, unknown, ticks, utc]);
}
