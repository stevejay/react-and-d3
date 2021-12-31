import { useMemo } from 'react';
import type { AxisDomain, AxisScale } from 'd3';
import * as d3 from 'd3';
import { isNil } from 'lodash-es';

export function useBandScale<CategoryT extends AxisDomain>(
  domain: readonly CategoryT[],
  range: readonly number[],
  options?: { paddingInner?: number; paddingOuter?: number }
): AxisScale<CategoryT> {
  const { paddingInner, paddingOuter } = options ?? {};
  return useMemo<AxisScale<CategoryT>>(() => {
    const scale = d3.scaleBand<CategoryT>();
    scale.domain(domain);
    scale.range(range);
    !isNil(paddingInner) && scale.paddingInner(paddingInner);
    !isNil(paddingOuter) && scale.paddingOuter(paddingOuter);
    return scale;
  }, [domain, range, paddingInner, paddingOuter]);
}
