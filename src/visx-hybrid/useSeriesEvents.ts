import { FocusEvent, PointerEvent, useCallback } from 'react';

import type { AxisScale, EventHandlerParams, SeriesProps } from './types';
import { useEventEmitters } from './useEventEmitters';
import { PointerEventHandlerParams, useEventHandlers } from './useEventHandlers';
import { useTooltipContext } from './useTooltipContext';

export type SeriesEventsParams<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = Pick<
  SeriesProps<IndependentScale, DependentScale, Datum>,
  'onBlur' | 'onFocus' | 'onPointerMove' | 'onPointerOut' | 'onPointerUp'
> &
  Pick<PointerEventHandlerParams<Datum>, 'dataKeyOrKeysRef' | 'allowedSources'> & {
    /** The source of emitted events. */
    source: string;
    enableEvents: boolean;
  };

/** This hook simplifies the logic for initializing Series event emitters + handlers. */
export function useSeriesEvents<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataKeyOrKeysRef,
  enableEvents,
  onBlur: onBlurProps,
  onFocus: onFocusProps,
  onPointerMove: onPointerMoveProps,
  onPointerOut: onPointerOutProps,
  onPointerUp: onPointerUpProps,
  source,
  allowedSources
}: SeriesEventsParams<IndependentScale, DependentScale, Datum>) {
  const { showTooltip, hideTooltip } = useTooltipContext<Datum>();

  const onPointerMove = useCallback(
    (params: readonly EventHandlerParams<Datum>[]) => {
      showTooltip(params);
      if (onPointerMoveProps) {
        onPointerMoveProps(params);
      }
    },
    [showTooltip, onPointerMoveProps]
  );

  const onFocus = useCallback(
    (params: readonly EventHandlerParams<Datum>[]) => {
      showTooltip(params);
      if (onFocusProps) {
        onFocusProps(params);
      }
    },
    [showTooltip, onFocusProps]
  );

  const onPointerOut = useCallback(
    (event: PointerEvent) => {
      hideTooltip();
      if (event && onPointerOutProps) {
        onPointerOutProps(event);
      }
    },
    [hideTooltip, onPointerOutProps]
  );

  const onBlur = useCallback(
    (event: FocusEvent) => {
      hideTooltip();
      if (event && onBlurProps) {
        onBlurProps(event);
      }
    },
    [hideTooltip, onBlurProps]
  );

  useEventHandlers({
    dataKeyOrKeysRef,
    onBlur: enableEvents ? onBlur : undefined,
    onFocus: enableEvents ? onFocus : undefined,
    onPointerMove: enableEvents ? onPointerMove : undefined,
    onPointerOut: enableEvents ? onPointerOut : undefined,
    onPointerUp: enableEvents ? onPointerUpProps : undefined,
    allowedSources
  });

  return useEventEmitters({
    source,
    onBlur: !!onBlurProps && enableEvents,
    onFocus: !!onFocusProps && enableEvents,
    onPointerMove: !!onPointerMoveProps && enableEvents,
    onPointerOut: !!onPointerOutProps && enableEvents,
    onPointerUp: !!onPointerUpProps && enableEvents
  });
}
