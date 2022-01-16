import { RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createUseGesture, dragAction, GestureHandlers, pinchAction, wheelAction } from '@use-gesture/react';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import { throttle } from 'lodash-es';

import { Point } from '@/types';

const useGesture = createUseGesture([dragAction, pinchAction, wheelAction]);

/**
 * Updates the x and y values of the zoom transform that is passed in. Returns a
 * new zoom transform object except when the passed zoom transform already has
 * the required x and y values.
 */
function updateTranslate(
  transform: ZoomTransform,
  p0: Point, // starting coordinate
  p1: Point // inverted starting coordinate
): ZoomTransform {
  const x = p0[0] - p1[0] * transform.k;
  const y = p0[1] - p1[1] * transform.k;
  return x === transform.x && y === transform.y ? transform : new ZoomTransform(transform.k, x, y);
}

export type ReturnType<ElementT extends SVGElement> = [RefObject<ElementT>, ZoomTransform];

export function useZoom<ElementT extends SVGElement>(): ReturnType<ElementT> {
  const ref = useRef<ElementT>(null!);

  // The underlying state.
  const [transform, setTransform] = useState(zoomIdentity);
  const setTransformThrottled = useMemo(() => throttle(setTransform, 100), []);

  // The transform via a ref so that the gesture callbacks can remain stable.
  const transformRef = useRef(transform);
  useLayoutEffect(() => {
    transformRef.current = transform;
  });

  // TODO why use these?
  useEffect(() => {
    const handler = (e: any) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    //   document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      // document.removeEventListener('gestureend', handler);
    };
  }, []);

  const handlers = useMemo<GestureHandlers>(
    () => ({
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) {
          return cancel();
        }
        setTransform((prev) => new ZoomTransform(prev.k, x, y));
        // onDrag(x, y);
      },
      onPinch: ({ first, origin: [originX, originY], memo, offset: [k] }) => {
        let currentMemo = memo;
        if (first) {
          const { top, left } = ref.current.getBoundingClientRect();
          // Get pinch starting coord relative to the top left corner of the rect element.
          const relativePoint = [originX - left, originY - top] as Point;
          // Also store the inverted version of the starting coord.
          currentMemo = [relativePoint, transformRef.current.invert(relativePoint)];
        }
        let newTransform = new ZoomTransform(k, 0, 0);
        newTransform = updateTranslate(newTransform, currentMemo[0], currentMemo[1]);
        // onPinch(newTransform);
        setTransformThrottled(newTransform);
        return currentMemo;
      }
    }),
    [setTransformThrottled]
  );

  // Stable config object.
  const config = useMemo(
    () => ({
      target: ref,
      eventOptions: { passive: false },
      drag: { from: () => [transformRef.current.x, transformRef.current.y], delay: false },
      pinch: { from: () => [transformRef.current.k], scaleBounds: { min: 0.5, max: 5 }, rubberband: true }
    }),
    []
  );

  useGesture(
    handlers,
    // {
    //   onDrag: ({ pinching, cancel, offset: [x, y] }) => {
    //     if (pinching) {
    //       return cancel();
    //     }
    //     setTransform((prev) => new ZoomTransform(prev.k, x, y));
    //     // onDrag(x, y);
    //   },
    //   onPinch: ({ first, last, origin: [originX, originY], memo, offset: [k] }) => {
    //     let currentMemo = memo;
    //     if (first) {
    //       const { top, left } = ref.current.getBoundingClientRect();
    //       // Get pinch starting coord relative to the top left corner of the rect element.
    //       const relativePoint = [originX - left, originY - top] as Point;
    //       // Also store the inverted version of the starting coord.
    //       currentMemo = [relativePoint, transformRef.current.invert(relativePoint)];
    //     }
    //     let newTransform = new ZoomTransform(k, 0, 0);
    //     newTransform = updateTranslate(newTransform, currentMemo[0], currentMemo[1]);
    //     // onPinch(newTransform);
    //     setTransform(transform);
    //     return currentMemo;
    //   }
    // },
    config
  );

  return [ref, transform];
}
