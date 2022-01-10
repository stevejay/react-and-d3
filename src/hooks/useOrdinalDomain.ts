import { useMemo } from 'react';
import { identity } from 'lodash-es';

import type { DomainValue } from '@/types';

// The domain will not be recalculated if you only change the accessor.
// This means the accessor function does not need to be referentially stable.
export function useOrdinalDomain<DatumT, CategoryT extends DomainValue>(
  data: readonly DatumT[],
  accessor: (d: DatumT) => CategoryT = identity
): readonly CategoryT[] {
  // Deliberately ignore accessor in useMemo deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => data.map(accessor), [data]);
}
