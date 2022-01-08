import { max } from 'd3-array';

import type { CategoryValueListDatum, DomainValue } from '@/types';

export function getSumOfValues<CategoryT extends DomainValue>(
  datum: CategoryValueListDatum<CategoryT, number>
) {
  let sum = 0;
  for (let property in datum.values) {
    sum += datum.values[property];
  }
  return sum;
}

export function getMaxOfValues<CategoryT extends DomainValue>(
  datum: CategoryValueListDatum<CategoryT, number>
) {
  let values = [];
  for (let property in datum.values) {
    values.push(datum.values[property]);
  }
  return max(values) ?? 0;
}

// TODO
// return max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })
