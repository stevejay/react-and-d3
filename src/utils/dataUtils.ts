import { max, min, sum } from 'd3-array';

import { CategoryValueDatum, CategoryValueListDatum, DomainValue } from '@/types';

export function flattenValueListDatum<CategoryT extends DomainValue>(
  datum: CategoryValueListDatum<CategoryT, number>,
  seriesKeys: readonly string[]
): readonly number[] {
  return seriesKeys.map((key) => datum.values[key]);
}

export function flattenValueDatum<CategoryT extends DomainValue>(
  datum: CategoryValueDatum<CategoryT, number>
): readonly number[] {
  return [datum.value];
}

export function getValueListDatumMinValue<CategoryT extends DomainValue>(
  datum: CategoryValueListDatum<CategoryT, number>,
  seriesKeys: readonly string[]
): number | null | undefined {
  return min(flattenValueListDatum(datum, seriesKeys));
}

export function getValueListDatumMaxValue<CategoryT extends DomainValue>(
  datum: CategoryValueListDatum<CategoryT, number>,
  seriesKeys: readonly string[]
): number | null | undefined {
  return max(flattenValueListDatum(datum, seriesKeys));
}

export function getValueListDatumSum<CategoryT extends DomainValue>(
  datum: CategoryValueListDatum<CategoryT, number>,
  seriesKeys: readonly string[]
): number | null | undefined {
  return sum(flattenValueListDatum(datum, seriesKeys));
}
