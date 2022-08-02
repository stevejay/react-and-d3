import { useCallback, useState } from 'react';

import type { ShowTooltipArgs, UseTooltipParams, UseTooltipState } from './types';

/**
 * @param initialTooltipState  Optional initial `TooltipState`.
 */
export function useTooltip<TooltipData = object>(
  initialTooltipState?: Partial<UseTooltipParams<TooltipData>>
): UseTooltipParams<TooltipData> {
  const [tooltipState, setTooltipState] = useState<UseTooltipState<TooltipData>>({
    tooltipOpen: false,
    ...initialTooltipState
  });

  const showTooltip = useCallback(
    (showArgs: ShowTooltipArgs<TooltipData>) =>
      setTooltipState(
        typeof showArgs === 'function'
          ? ({ tooltipOpen: _tooltipOpen, ...show }) => ({ ...showArgs(show), tooltipOpen: true })
          : {
              tooltipOpen: true,
              tooltipLeft: showArgs.tooltipLeft,
              tooltipTop: showArgs.tooltipTop,
              tooltipData: showArgs.tooltipData
            }
      ),
    [setTooltipState]
  );

  const hideTooltip = useCallback(
    () => setTooltipState((state) => ({ ...state, tooltipOpen: false })),
    [setTooltipState]
  );

  return {
    tooltipOpen: tooltipState.tooltipOpen,
    tooltipLeft: tooltipState.tooltipLeft,
    tooltipTop: tooltipState.tooltipTop,
    tooltipData: tooltipState.tooltipData,
    updateTooltip: setTooltipState,
    showTooltip,
    hideTooltip
  };
}
