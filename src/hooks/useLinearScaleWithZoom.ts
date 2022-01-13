import { useMemo } from 'react';
import { ScaleLinear } from 'd3-scale';
import { ZoomTransform } from 'd3-zoom';

import { useLinearScale } from './useLinearScale';

function invertX(transform: ZoomTransform, x: number) {
  return (x - transform.x) / transform.k;
}

function invertY(transform: ZoomTransform, y: number) {
  return (y - transform.y) / transform.k;
}

function rescaleX(x: ScaleLinear<number, number>, transform: ZoomTransform) {
  return x.copy().domain(
    x
      .range()
      .map((r) => invertX(transform, r))
      .map((r) => x.invert(r))
  );
}

function rescaleY(y: ScaleLinear<number, number>, transform: ZoomTransform) {
  return y.copy().domain(
    y
      .range()
      .map((r) => invertY(transform, r))
      .map((r) => y.invert(r))
  );
}

// The domain and range need to be referentially stable. The options object does
// not need to be referentially stable.
export function useLinearScaleWithZoom(
  domain: readonly number[],
  range: readonly number[],
  axis: 'x' | 'y',
  transform: ZoomTransform,
  options?: { nice?: boolean; rangeRound?: boolean; clamp?: boolean; unknown?: number; ticks?: number }
) {
  const linearScale = useLinearScale(domain, range, options);
  return useMemo(() => {
    // console.log('linearScale', linearScale.domain(), linearScale.range());
    return (axis === 'x' ? rescaleX : rescaleY)(linearScale, transform);
  }, [linearScale, transform, axis]);
}
