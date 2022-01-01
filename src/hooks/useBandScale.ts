import { useMemo } from 'react';
import type { AxisDomain, AxisScale } from 'd3';
import * as d3 from 'd3';
import { isNil } from 'lodash-es';

// TODO ensure that options can be undone.
// The domain and range need to be stable. The options object does not need to be stable.
export function useBandScale<CategoryT extends AxisDomain>(
  domain: readonly CategoryT[],
  range: readonly number[],
  options?: { paddingInner?: number; paddingOuter?: number; rangeRound?: boolean }
): AxisScale<CategoryT> {
  const { paddingInner, paddingOuter, rangeRound } = options ?? {};
  return useMemo<AxisScale<CategoryT>>(() => {
    const scale = d3.scaleBand<CategoryT>();
    scale.domain(domain);
    scale.range(range);
    !isNil(paddingInner) && scale.paddingInner(paddingInner);
    !isNil(paddingOuter) && scale.paddingOuter(paddingOuter);
    rangeRound && scale.round(true);
    return scale;
  }, [domain, range, paddingInner, paddingOuter, rangeRound]);
}
