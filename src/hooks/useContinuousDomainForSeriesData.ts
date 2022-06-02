import { useMemo } from 'react';
import { max, min } from 'd3-array';
import { isNil } from 'lodash-es';

import { CategoryValueListDatum, DomainValue, GetValueListDatumSummaryValue } from '@/types';

// The two accessor functions need to be referentially stable, or only change when `data` or
// `seriesKeys` change.
export function useContinuousDomainForSeriesData<CategoryT extends DomainValue, ValueT extends DomainValue>(
  data: readonly CategoryValueListDatum<CategoryT, ValueT>[],
  seriesKeys: readonly string[],
  minAccessor: GetValueListDatumSummaryValue<CategoryT, ValueT>,
  maxAccessor: GetValueListDatumSummaryValue<CategoryT, ValueT>,
  options?: { includeZeroInDomain?: boolean }
): readonly number[] {
  const { includeZeroInDomain } = options ?? {};
  return useMemo(() => {
    let minValue = min(data, (datum) => minAccessor(datum, seriesKeys)) ?? 0;
    let maxValue = max(data, (datum) => maxAccessor(datum, seriesKeys)) ?? 0;
    if (isNil(minValue) || isNil(maxValue)) {
      return [];
    }
    if (includeZeroInDomain) {
      if (minValue > 0) {
        minValue = 0;
      } else if (maxValue < 0) {
        maxValue = 0;
      }
    }
    return [minValue, maxValue] as const;
  }, [data, seriesKeys, includeZeroInDomain, minAccessor, maxAccessor]);
}
