import { FocusEvent, PointerEvent, useCallback } from 'react';
import { isNil } from 'lodash-es';

import { HandlerParams } from './EventEmitterProvider';
import { isDefined } from './isDefined';
import { isPointerEvent } from './isPointerEvent';
import type { EventHandlerParams } from './types';
import { useEventEmitterSubscription } from './useEventEmitterSubscription';
import { useXYChartContext } from './useXYChartContext';

export const POINTER_EVENTS_ALL = '__POINTER_EVENTS_ALL';
export const POINTER_EVENTS_NEAREST = '__POINTER_EVENTS_NEAREST';

export type PointerEventHandlerParams<Datum extends object> = {
  /** Controls whether callbacks are invoked for one or more registered dataKeys, the nearest dataKey, or all dataKeys. */
  dataKeyOrKeysRef: string | readonly string[] | typeof POINTER_EVENTS_NEAREST | typeof POINTER_EVENTS_ALL; // last two are eaten by string
  // /** Optionally override the findNearestDatum logic. */
  // findNearestDatum?: (params: NearestDatumArgs<Datum>) => NearestDatumReturnType<Datum>;
  /** Callback invoked onFocus for one or more series based on dataKey. */
  onFocus?: (params: readonly EventHandlerParams<Datum>[]) => void;
  /** Callback invoked onBlur. */
  onBlur?: (event: FocusEvent) => void;
  /** Callback invoked onPointerMove for one or more series based on dataKey. */
  onPointerMove?: (params: readonly EventHandlerParams<Datum>[]) => void;
  /** Callback invoked onPointerOut. */
  onPointerOut?: (event: PointerEvent) => void;
  /** Callback invoked onPointerUp for one or more series based on dataKey. */
  onPointerUp?: (params: readonly EventHandlerParams<Datum>[]) => void;
  /** Valid event sources for which to invoke handlers. */
  allowedSources?: string[];
};

/**
 * Hook that returns PointerEvent handlers that invoke the passed pointer
 * handlers with the nearest datum to the event for the passed dataKey.
 */
export function useEventHandlers<Datum extends object>({
  dataKeyOrKeysRef,
  // findNearestDatum: userFindNearestDatum,
  onBlur,
  onFocus,
  onPointerMove,
  onPointerOut,
  onPointerUp,
  allowedSources
}: PointerEventHandlerParams<Datum>) {
  const { width, height, horizontal, dataEntryStore, scales } = useXYChartContext();

  // const findNearestDatum = userFindNearestDatum || (horizontal ? findNearestDatumY : findNearestDatumX);

  // this logic is shared by pointerup, pointermove, and focus handlers
  const getHandlerParams = useCallback(
    (params?: HandlerParams) => {
      const { svgPoint, event } = params || {};
      const pointerParamsByKey: { [dataKey: string]: EventHandlerParams<Datum> } = {};

      // nearest Datum across all dataKeys, if relevant
      let nearestDatumPointerParams: EventHandlerParams<Datum> | null = null;
      let nearestDatumDistance = Infinity;

      if (
        params &&
        event &&
        svgPoint &&
        width &&
        height &&
        !isNil(scales.independent) &&
        !isNil(scales.dependent)
      ) {
        const considerAllKeys =
          dataKeyOrKeysRef === POINTER_EVENTS_NEAREST || dataKeyOrKeysRef === POINTER_EVENTS_ALL;

        const dataKeys = considerAllKeys
          ? dataEntryStore.getAllDataKeys()
          : Array.isArray(dataKeyOrKeysRef)
          ? dataKeyOrKeysRef
          : [dataKeyOrKeysRef];

        // find nearestDatum for relevant dataKey(s)
        dataKeys.forEach((dataKey) => {
          const dataEntry = dataEntryStore.tryGetByDataKey(dataKey);
          if (dataEntry) {
            const nearestDatum = dataEntry.findNearestDatum({
              horizontal,
              width,
              height,
              point: svgPoint,
              scales
            });

            if (nearestDatum) {
              pointerParamsByKey[dataKey] = { key: dataKey, svgPoint, event, ...nearestDatum };

              // compute nearest Datum if not emitting events for all keys
              if (dataKeyOrKeysRef === POINTER_EVENTS_NEAREST) {
                const distance = Math.sqrt(
                  (nearestDatum.distanceX ?? Infinity ** 2) + (nearestDatum.distanceY ?? Infinity ** 2)
                );
                nearestDatumPointerParams =
                  distance < nearestDatumDistance ? pointerParamsByKey[dataKey] : nearestDatumPointerParams;
                nearestDatumDistance = Math.min(nearestDatumDistance, distance);
              }
            }
          }
        });

        const pointerParams: (EventHandlerParams<Datum> | null)[] =
          dataKeyOrKeysRef === POINTER_EVENTS_NEAREST
            ? [nearestDatumPointerParams]
            : dataKeyOrKeysRef === POINTER_EVENTS_ALL || Array.isArray(dataKeyOrKeysRef)
            ? Object.values(pointerParamsByKey)
            : [pointerParamsByKey[dataKeyOrKeysRef as string]];

        return pointerParams.filter(isDefined);
      }
      return [];
    },
    [dataKeyOrKeysRef, dataEntryStore, scales, width, height, horizontal]
  );

  const handlePointerMove = useCallback(
    (params?: HandlerParams) => {
      if (onPointerMove) {
        const handlerParams = getHandlerParams(params);
        onPointerMove(handlerParams);
      }
    },
    [getHandlerParams, onPointerMove]
  );

  const handlePointerUp = useCallback(
    (params?: HandlerParams) => {
      if (onPointerUp) {
        const handlerParams = getHandlerParams(params);
        onPointerUp(handlerParams);
      }
    },
    [getHandlerParams, onPointerUp]
  );

  const handleFocus = useCallback(
    (params?: HandlerParams) => {
      if (onFocus) {
        const handlerParams = getHandlerParams(params);
        onFocus(handlerParams);
      }
    },
    [getHandlerParams, onFocus]
  );

  const handlePointerOut = useCallback(
    (params?: HandlerParams) => {
      const event = params?.event;
      if (event && isPointerEvent(event) && onPointerOut) {
        onPointerOut(event);
      }
    },
    [onPointerOut]
  );

  const handleBlur = useCallback(
    (params?: HandlerParams) => {
      const event = params?.event;
      if (event && !isPointerEvent(event) && onBlur) {
        onBlur(event);
      }
    },
    [onBlur]
  );

  useEventEmitterSubscription('pointermove', onPointerMove ? handlePointerMove : undefined, allowedSources);
  useEventEmitterSubscription('pointerout', onPointerOut ? handlePointerOut : undefined, allowedSources);
  useEventEmitterSubscription('pointerup', onPointerUp ? handlePointerUp : undefined, allowedSources);
  useEventEmitterSubscription('focus', onFocus ? handleFocus : undefined, allowedSources);
  useEventEmitterSubscription('blur', onBlur ? handleBlur : undefined, allowedSources);
}
