import { ReactNode, useCallback, useMemo, useRef } from 'react';
import { debounce } from 'lodash-es';

import { defaultHideTooltipDebounceMs } from './constants';
import { isValidNumber } from './isValidNumber';
import { TooltipContext } from './TooltipContext';
import type { EventHandlerParams, TooltipData } from './types';
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
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    updateTooltip,
    hideTooltip: privateHideTooltip
  } = useTooltip<TooltipData<Datum>>(undefined);

  const debouncedHideTooltip = useRef<ReturnType<typeof debounce> | null>(null);

  const showTooltip = useCallback(
    ({ svgPoint, index, key, datum, distanceX, distanceY, ...rest }: EventHandlerParams<Datum>) => {
      // cancel any hideTooltip calls so it won't hide after invoking the logic below
      if (debouncedHideTooltip.current) {
        debouncedHideTooltip.current.cancel();
        debouncedHideTooltip.current = null;
      }

      const cleanDistanceX = isValidNumber(distanceX) ? distanceX : Infinity;
      const cleanDistanceY = isValidNumber(distanceY) ? distanceY : Infinity;
      const distance = Math.sqrt(cleanDistanceX ** 2 + cleanDistanceY ** 2);

      updateTooltip(({ tooltipData: currentTooltipData }) => {
        const currNearestDatumDistance =
          currentTooltipData?.nearestDatum && isValidNumber(currentTooltipData.nearestDatum.distance)
            ? currentTooltipData.nearestDatum.distance
            : Infinity;

        return {
          tooltipOpen: true,
          tooltipLeft: svgPoint?.x,
          tooltipTop: svgPoint?.y,
          tooltipData: {
            nearestDatum:
              (currentTooltipData?.nearestDatum?.key ?? '') !== key && currNearestDatumDistance < distance
                ? currentTooltipData?.nearestDatum
                : { key, index, datum, distance, ...rest },
            datumByKey: {
              ...currentTooltipData?.datumByKey,
              [key]: {
                datum,
                index,
                key,
                ...rest
              }
            }
          }
        };
      });
    },
    [updateTooltip]
  );

  // // TODO turn into lazy init to avoid creating this func on every render.
  // const showTooltip = useRef(
  //   ({ svgPoint, index, key, datum, distanceX, distanceY, ...rest }: EventHandlerParams<Datum>) => {
  //     // cancel any hideTooltip calls so it won't hide after invoking the logic below
  //     if (debouncedHideTooltip.current) {
  //       debouncedHideTooltip.current.cancel();
  //       debouncedHideTooltip.current = null;
  //     }

  //     const cleanDistanceX = isValidNumber(distanceX) ? distanceX : Infinity;
  //     const cleanDistanceY = isValidNumber(distanceY) ? distanceY : Infinity;
  //     const distance = Math.sqrt(cleanDistanceX ** 2 + cleanDistanceY ** 2);

  //     updateTooltip(({ tooltipData: currentTooltipData }) => {
  //       const currNearestDatumDistance =
  //         currentTooltipData?.nearestDatum && isValidNumber(currentTooltipData.nearestDatum.distance)
  //           ? currentTooltipData.nearestDatum.distance
  //           : Infinity;
  //       return {
  //         tooltipOpen: true,
  //         tooltipLeft: svgPoint?.x,
  //         tooltipTop: svgPoint?.y,
  //         tooltipData: {
  //           nearestDatum:
  //             (currentTooltipData?.nearestDatum?.key ?? '') !== key && currNearestDatumDistance < distance
  //               ? currentTooltipData?.nearestDatum
  //               : { key, index, datum, distance, ...rest },
  //           datumByKey: {
  //             ...currentTooltipData?.datumByKey,
  //             [key]: {
  //               datum,
  //               index,
  //               key,
  //               ...rest
  //             }
  //           }
  //         }
  //       };
  //     });
  //   }
  // );

  const hideTooltip = useCallback(() => {
    debouncedHideTooltip.current = debounce(privateHideTooltip, hideTooltipDebounceMs);
    debouncedHideTooltip.current();
  }, [privateHideTooltip, hideTooltipDebounceMs]);

  const contextValue = useMemo(
    () => ({
      tooltipOpen,
      tooltipLeft,
      tooltipTop,
      tooltipData,
      updateTooltip,
      showTooltip,
      hideTooltip
    }),
    [tooltipOpen, tooltipLeft, tooltipTop, tooltipData, updateTooltip, showTooltip, hideTooltip]
  );

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
}
