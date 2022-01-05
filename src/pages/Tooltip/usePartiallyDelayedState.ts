import { MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

// https://github.com/makannew/use-delayed-state/blob/master/src/index.js

function clearTimeoutAndRef(ref: MutableRefObject<number | null>) {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
}

export function usePartiallyDelayedState<StateT>(
  initialState: StateT
): [StateT, (newState: SetStateAction<StateT>, delay: number) => void, () => void] {
  const [state, setState] = useState<StateT>(initialState);
  const setStateTimeoutRef = useRef<number | null>(null);
  const doNotDelayTimeoutRef = useRef<number | null>(null);
  const doNotDelayRef = useRef<boolean>(false);

  const setStateAfter = useCallback((newState: SetStateAction<StateT>, delay: number) => {
    clearTimeoutAndRef(setStateTimeoutRef);

    if (delay === 0 || delay === undefined || doNotDelayRef.current) {
      setState(newState);
      //   console.log('---- non delayed setstate', delay, doNotDelayRef.current);

      // TODO temp hack - should be some condition for detecting closing
      if (delay === 0) {
        clearTimeoutAndRef(doNotDelayTimeoutRef);

        doNotDelayTimeoutRef.current = window.setTimeout(() => {
          doNotDelayTimeoutRef.current = null;
          doNotDelayRef.current = false;
          //   console.log('  doNotDelay is now false');
        }, 1000);
      } else {
        clearTimeoutAndRef(doNotDelayTimeoutRef);
        //   console.log('    cleared do not delay timeout');
      }
    } else {
      //   console.log('  queueing up set state timeout');

      setStateTimeoutRef.current = window.setTimeout(() => {
        setState(newState);
        setStateTimeoutRef.current = null;
        doNotDelayRef.current = true;
        // console.log('---- delayed setstate', 'doNotDelay is now true');
      }, delay);

      clearTimeoutAndRef(doNotDelayTimeoutRef);
      // console.log('    cleared do not delay timeout');
    }
  }, []);

  const cancelSetState = useCallback(() => {
    clearTimeoutAndRef(setStateTimeoutRef);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeoutAndRef(setStateTimeoutRef);
      clearTimeoutAndRef(doNotDelayTimeoutRef);
    };
  }, []);

  return [state, setStateAfter, cancelSetState];
}
