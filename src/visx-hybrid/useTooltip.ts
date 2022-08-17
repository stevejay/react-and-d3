import { useState } from 'react';

import type { UseTooltipParams, UseTooltipState } from './types';

export function useTooltip<Datum extends object = object>(
  initialTooltipState?: Partial<UseTooltipParams<Datum>>
): UseTooltipParams<Datum> {
  const [tooltipState, setTooltipState] = useState<UseTooltipState<Datum>>({
    tooltipOpen: false,
    ...initialTooltipState
  });

  // const hideTooltip = useCallback(
  //   () => setTooltipState((state) => ({ ...state, tooltipOpen: false })),
  //   [setTooltipState]
  // );

  return { ...tooltipState, updateTooltip: setTooltipState /*, hideTooltip */ };
}
