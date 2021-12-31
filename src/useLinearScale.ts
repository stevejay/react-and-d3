import { useMemo } from 'react';
import type { AxisScale } from 'd3';
import * as d3 from 'd3';

// This only supports continuous scales that have two values each in their domain and range.
// All of the args do not need to be stable.
export function useLinearScale(
  domain: readonly number[],
  range: readonly number[],
  options?: { nice?: boolean; rangeRound?: boolean; clamp?: boolean; unknown?: number; ticks?: number }
): AxisScale<number> {
  const { nice, rangeRound, clamp, unknown, ticks } = options ?? {};
  return useMemo<AxisScale<number>>(() => {
    const scale = d3.scaleLinear();
    scale.domain(domain);
    scale.range(range);
    nice && scale.nice(); // 'Nice'-ing must happen after setting the domain.
    rangeRound && scale.interpolate(d3.interpolateRound);
    clamp && scale.clamp();
    scale.unknown(unknown);
    scale.ticks(ticks ?? 10);
    return scale;
  }, [domain, range, nice, rangeRound, clamp, unknown, ticks]);
}
