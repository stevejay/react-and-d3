import { ReactNode, useCallback, useMemo, useRef } from 'react';
import { debounce } from 'debounce';

import { defaultHideTooltipDebounceMs } from './constants';
import { isValidNumber } from './isValidNumber';
import { TooltipStateContext } from './TooltipStateContext';
import { TooltipUpdateContext } from './TooltipUpdateContext';
import type { EventHandlerParams } from './types';
import { useTooltip } from './useTooltip';

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
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, updateTooltip } = useTooltip<Datum>(undefined);

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

      updateTooltip({
        tooltipOpen: true,
        tooltipLeft: nearestDatum.svgPoint?.x,
        tooltipTop: nearestDatum.svgPoint?.y,
        tooltipData: {
          nearestDatum: { ...nearestDatum, distance: distances[indexOfNearestDatum] },
          datumByKey: new Map(eventParamsList.map((item) => [item.key, item]))
        }
      });
    },
    [updateTooltip]
  );

  const privateHideTooltip = useCallback(
    () => updateTooltip((state) => ({ ...state, tooltipOpen: false })),
    [updateTooltip]
  );

  const hideTooltip = useCallback(() => {
    debouncedHideTooltip.current = debounce(privateHideTooltip, hideTooltipDebounceMs);
    debouncedHideTooltip.current();
  }, [privateHideTooltip, hideTooltipDebounceMs]);

  const stateContextValue = useMemo(
    () => ({
      tooltipOpen,
      tooltipLeft,
      tooltipTop,
      tooltipData
    }),
    [tooltipOpen, tooltipLeft, tooltipTop, tooltipData]
  );

  const controlContextValue = useMemo(
    () => ({
      showTooltip,
      hideTooltip
    }),
    [showTooltip, hideTooltip]
  );

  // Split the tooltip context into two so that the chart series don't rerender when the tooltip is showing.
  return (
    <TooltipStateContext.Provider value={stateContextValue}>
      <TooltipUpdateContext.Provider value={controlContextValue}>{children}</TooltipUpdateContext.Provider>
    </TooltipStateContext.Provider>
  );
}
