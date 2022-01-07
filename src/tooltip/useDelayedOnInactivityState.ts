import { MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

function clearTimeoutRef(ref: MutableRefObject<number | null>) {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
}

export type ReturnValue<StateT> = [
  StateT,
  (newState: SetStateAction<StateT>, showDelayMs: number) => void,
  () => void
];

/**
 * This is an almost drop-in replacement hook for React.useState when you want
 * to delay setting state if the state has not been set within
 * `delayBeforeWaitingForInactivityMs` milliseconds. The difference with
 * React.useState is that the setter function has an extra `showDelayMs`
 * argument. This is how long in milliseconds that the setting of state should
 * be delayed by if state has not been set for
 * `delayBeforeWaitingForInactivityMs` milliseconds. If you need to change state
 * immediately then pass `0` as the `showDelayMs` value.
 */
// Derived from https://github.com/makannew/use-delayed-state/blob/master/src/index.js
export function useDelayedOnInactivityState<StateT>(
  initialState: StateT,
  delayBeforeWaitingForInactivityMs: number = 500
): ReturnValue<StateT> {
  const [state, setState] = useState<StateT>(initialState);
  const setStateTimeoutRef = useRef<number | null>(null);
  const doNotDelayTimeoutRef = useRef<number | null>(null);
  const doNotDelayRef = useRef<boolean>(false);

  const setStateAfter = useCallback(
    (newState: SetStateAction<StateT>, showDelayMs: number) => {
      clearTimeoutRef(setStateTimeoutRef);
      clearTimeoutRef(doNotDelayTimeoutRef);

      if (!showDelayMs || doNotDelayRef.current) {
        setState(newState);

        if (showDelayMs === 0) {
          doNotDelayTimeoutRef.current = window.setTimeout(() => {
            clearTimeoutRef(doNotDelayTimeoutRef);
            doNotDelayRef.current = false;
          }, delayBeforeWaitingForInactivityMs);
        }
      } else {
        setStateTimeoutRef.current = window.setTimeout(() => {
          setState(newState);
          clearTimeoutRef(setStateTimeoutRef);
          doNotDelayRef.current = true;
        }, showDelayMs);
      }
    },
    [delayBeforeWaitingForInactivityMs]
  );

  // Clear any active timeouts on unmount or a change to delayBeforeWaitingForInactivityMs.
  useEffect(() => {
    return () => {
      clearTimeoutRef(setStateTimeoutRef);
      clearTimeoutRef(doNotDelayTimeoutRef);
    };
  }, [delayBeforeWaitingForInactivityMs]);

  // Support cancelling a pending state set.
  const cancelSetState = useCallback(() => {
    clearTimeoutRef(setStateTimeoutRef);
  }, []);

  return [state, setStateAfter, cancelSetState];
}
