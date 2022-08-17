import { useState } from 'react';

import type { TooltipState } from './types';

export function useTooltip<Datum extends object = object>(
  initialTooltipState?: Partial<TooltipState<Datum>>
) {
  const [tooltipState, setTooltipState] = useState<TooltipState<Datum>>({
    tooltipOpen: false,
    ...initialTooltipState
  });

  // const hideTooltip = useCallback(
  //   () => setTooltipState((state) => ({ ...state, tooltipOpen: false })),
  //   [setTooltipState]
  // );

  return { ...tooltipState, updateTooltip: setTooltipState /*, hideTooltip */ };
}
