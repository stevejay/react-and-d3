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
