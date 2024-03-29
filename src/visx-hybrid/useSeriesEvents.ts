import { FocusEvent, PointerEvent, useCallback } from 'react';

import type { BasicSeriesProps, EventHandlerParams } from './types';
import { useEventEmitters } from './useEventEmitters';
import { PointerEventHandlerParams, useEventHandlers } from './useEventHandlers';
import { useTooltipVisibilityContext } from './useTooltipVisibilityContext';

export type SeriesEventsParams<Datum extends object> = Pick<
  BasicSeriesProps<Datum>,
  'onBlur' | 'onFocus' | 'onPointerMove' | 'onPointerDown' | 'onPointerOut' | 'onPointerUp'
> &
  Pick<PointerEventHandlerParams<Datum>, 'dataKeyOrKeysRef' | 'allowedSources'> & {
    /** The source of emitted events. */
    source: string;
    enableEvents: boolean;
  };

/** This hook simplifies the logic for initializing Series event emitters + handlers. */
export function useSeriesEvents<Datum extends object>({
  dataKeyOrKeysRef,
  enableEvents,
  onBlur: onBlurProps,
  onFocus: onFocusProps,
  onPointerMove: onPointerMoveProps,
  onPointerDown: onPointerDownProps,
  onPointerOut: onPointerOutProps,
  onPointerUp: onPointerUpProps,
  source,
  allowedSources
}: SeriesEventsParams<Datum>) {
  const { showTooltip, hideTooltip } = useTooltipVisibilityContext<Datum>();

  const onPointerMove = useCallback(
    (params: readonly EventHandlerParams<Datum>[]) => {
      showTooltip(params);
      if (onPointerMoveProps) {
        onPointerMoveProps(params);
      }
    },
    [showTooltip, onPointerMoveProps]
  );

  const onPointerDown = useCallback(
    (params: readonly EventHandlerParams<Datum>[]) => {
      showTooltip(params);
      if (onPointerDownProps) {
        onPointerDownProps(params);
      }
    },
    [showTooltip, onPointerDownProps]
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
      hideTooltip(event);
      if (event && onPointerOutProps) {
        onPointerOutProps(event);
      }
    },
    [hideTooltip, onPointerOutProps]
  );

  const onBlur = useCallback(
    (event: FocusEvent) => {
      hideTooltip(event);
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
    onPointerDown: enableEvents ? onPointerDown : undefined,
    onPointerOut: enableEvents ? onPointerOut : undefined,
    onPointerUp: enableEvents ? onPointerUpProps : undefined,
    allowedSources
  });

  return useEventEmitters({
    source,
    onBlur: !!onBlurProps && enableEvents,
    onFocus: !!onFocusProps && enableEvents,
    onPointerMove: !!onPointerMoveProps && enableEvents,
    onPointerDown: !!onPointerDownProps && enableEvents,
    onPointerOut: !!onPointerOutProps && enableEvents,
    onPointerUp: !!onPointerUpProps && enableEvents
  });
}
