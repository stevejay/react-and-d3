import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { debounce } from 'debounce';

import { defaultHideTooltipDebounceMs } from './constants';
import { isValidNumber } from './isValidNumber';
import { TooltipStateContext } from './TooltipStateContext';
import { TooltipVisibilityContext } from './TooltipVisibilityContext';
import type { EventHandlerParams, TooltipState } from './types';

type TooltipProviderProps = {
  /** Debounce time for when `hideTooltip` is invoked. */
  hideTooltipDebounceMs?: number;
  children: ReactNode;
};

/** Simple wrapper around useTooltip, to provide tooltip data via context. */
export function TooltipProvider<Datum extends object>({
  hideTooltipDebounceMs = defaultHideTooltipDebounceMs,
  children
}: TooltipProviderProps) {
  const [{ tooltipOpen, tooltipLeft, tooltipTop, tooltipData }, setTooltipState] = useState<
    TooltipState<Datum>
  >({ tooltipOpen: false });

  const debouncedHideTooltip = useRef<ReturnType<typeof debounce> | null>(null);

  const showTooltip = useCallback(
    (eventParamsList: readonly EventHandlerParams<Datum>[]) => {
      // cancel any hideTooltip calls so it won't hide after invoking the logic below
      if (debouncedHideTooltip.current) {
        debouncedHideTooltip.current.clear();
        debouncedHideTooltip.current = null;
      }

      if (!eventParamsList.length) {
        return;
      }

      const distances = eventParamsList.map(({ distanceX, distanceY }) => {
        const cleanDistanceX = isValidNumber(distanceX) ? distanceX : Infinity;
        const cleanDistanceY = isValidNumber(distanceY) ? distanceY : Infinity;
        return Math.sqrt(cleanDistanceX ** 2 + cleanDistanceY ** 2);
      });

      const indexOfNearestDatum = distances.reduce((result, distance, currentIndex) => {
        return distance < distances[result] ? currentIndex : result;
      }, 0);

      const nearestDatum = eventParamsList[indexOfNearestDatum];

      setTooltipState({
        tooltipOpen: true,
        tooltipLeft: nearestDatum.svgPoint?.x,
        tooltipTop: nearestDatum.svgPoint?.y,
        tooltipData: {
          nearestDatum: { ...nearestDatum, distance: distances[indexOfNearestDatum] },
          datumByKey: new Map(eventParamsList.map((item) => [item.dataKey, item]))
        }
      });
    },
    [setTooltipState]
  );

  const privateHideTooltip = useCallback(
    () => setTooltipState((state) => ({ ...state, tooltipOpen: false })),
    [setTooltipState]
  );

  const hideTooltip = useCallback(() => {
    debouncedHideTooltip.current = debounce(privateHideTooltip, hideTooltipDebounceMs);
    debouncedHideTooltip.current();
  }, [privateHideTooltip, hideTooltipDebounceMs]);

  const stateContextValue = useMemo(
    () => ({ tooltipOpen, tooltipLeft, tooltipTop, tooltipData }),
    [tooltipOpen, tooltipLeft, tooltipTop, tooltipData]
  );

  const controlContextValue = useMemo(() => ({ showTooltip, hideTooltip }), [showTooltip, hideTooltip]);

  // I split the tooltip context into two so that all the chart series don't rerender when the tooltip is updating.
  return (
    <TooltipStateContext.Provider value={stateContextValue}>
      <TooltipVisibilityContext.Provider value={controlContextValue}>
        {children}
      </TooltipVisibilityContext.Provider>
    </TooltipStateContext.Provider>
  );
}
