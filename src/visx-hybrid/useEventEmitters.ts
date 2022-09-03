import { FocusEvent, PointerEvent, useCallback } from 'react';

import { useEventEmitter } from './useEventEmitter';

type PointerEventEmitterParams = {
  /** Source of the events, e.g., the component name. */
  source: string;
  onBlur?: boolean;
  onFocus?: boolean;
  onPointerMove?: boolean;
  onPointerDown?: boolean;
  onPointerOut?: boolean;
  onPointerUp?: boolean;
};

/**
 * A hook that simplifies creation of handlers for emitting
 * pointermove, pointerout, and pointerup events to EventEmitterContext.
 */
export function useEventEmitters({
  source,
  onPointerOut = true,
  onPointerMove = true,
  onPointerDown = true,
  onPointerUp = true,
  onFocus = false,
  onBlur = false
}: PointerEventEmitterParams) {
  const emit = useEventEmitter();

  const emitPointerMove = useCallback(
    (event: PointerEvent) => emit?.('pointermove', event, source),
    [emit, source]
  );

  const emitPointerDown = useCallback(
    (event: PointerEvent) => emit?.('pointerdown', event, source),
    [emit, source]
  );

  const emitPointerOut = useCallback(
    (event: PointerEvent) => emit?.('pointerout', event, source),
    [emit, source]
  );

  const emitPointerUp = useCallback(
    (event: PointerEvent) => emit?.('pointerup', event, source),
    [emit, source]
  );

  const emitFocus = useCallback((event: FocusEvent) => emit?.('focus', event, source), [emit, source]);
  const emitBlur = useCallback((event: FocusEvent) => emit?.('blur', event, source), [emit, source]);

  return {
    onPointerMove: onPointerMove ? emitPointerMove : undefined,
    onPointerDown: onPointerDown ? emitPointerDown : undefined,
    onFocus: onFocus ? emitFocus : undefined,
    onBlur: onBlur ? emitBlur : undefined,
    onPointerOut: onPointerOut ? emitPointerOut : undefined,
    onPointerUp: onPointerUp ? emitPointerUp : undefined
  };
}
