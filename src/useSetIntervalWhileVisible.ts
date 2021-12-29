import { useEffect, useLayoutEffect, useRef } from 'react';
import { useIntersectionObserver } from 'react-intersection-observer-hook';

import { useDocumentVisibility } from '@/DocumentVisibility';

export function useSetIntervalWhileVisible(cb: () => void, ms: number) {
  const isDocumentVisible = useDocumentVisibility();
  const callbackRef = useRef<() => void>(cb);

  const [ref, { entry }] = useIntersectionObserver();
  const isElementVisible = entry && entry.isIntersecting;

  useLayoutEffect(() => {
    callbackRef.current = cb;
  }, [cb]);

  useEffect(() => {
    if (!isDocumentVisible || !isElementVisible) {
      return;
    }
    const id = setInterval(callbackRef.current, ms);
    return () => clearInterval(id);
  }, [isDocumentVisible, isElementVisible, ms]);

  return ref;
}
