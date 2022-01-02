import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

// https://github.com/makannew/use-delayed-state/blob/master/src/index.js

export function useDelayedState<StateT>(
  initialState: StateT
): [StateT, (newState: SetStateAction<StateT>, delay: number) => void, () => void] {
  const [state, setState] = useState<StateT>(initialState);
  const timeoutRef = useRef<number | null>();

  const setStateAfter = useCallback((newState: SetStateAction<StateT>, delay: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (delay === 0 || delay === undefined) {
      setState(newState);
    } else {
      //   if (timeoutRef.current) {
      //     clearTimeout(timeoutRef.current);
      //   }
      timeoutRef.current = setTimeout(() => {
        setState(newState);
        timeoutRef.current = null;
      }, delay) as any; // TODO fix
    }
  }, []);

  const cancelSetState = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, setStateAfter, cancelSetState];
}
