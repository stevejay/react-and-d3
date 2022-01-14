import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react';
import { ZoomTransform } from 'd3-zoom';

import { SvgGroup } from '@/components/SvgGroup';
import type { ChartArea } from '@/types';

const useGesture = createUseGesture([dragAction, pinchAction]);

/**
 * Updates the scale value of the zoom transform that is passed in. Returns a
 * new zoom transform object except when the passed zoom transform already has
 * the required scale value.
 */
// function updateScale(transform: ZoomTransform, k: number): ZoomTransform {
//   return k === transform.k ? transform : new ZoomTransform(k, transform.x, transform.y);
// }

/**
 * Updates the x and y values of the zoom transform that is passed in. Returns a
 * new zoom transform object except when the passed zoom transform already has
 * the required x and y values.
 */
function updateTranslate(
  transform: ZoomTransform,
  p0: [number, number], // starting coordinate
  p1: [number, number] // inverted starting coordinate
): ZoomTransform {
  const x = p0[0] - p1[0] * transform.k;
  const y = p0[1] - p1[1] * transform.k;
  return x === transform.x && y === transform.y ? transform : new ZoomTransform(transform.k, x, y);
}

export type SvgZoomInteractionProps = {
  chartArea: ChartArea;
  className?: string;
  getCurrentTransform: () => ZoomTransform;
  onDrag: (x: number, y: number) => void;
  onPinch: (transform: ZoomTransform) => void;
};

export const SvgZoomInteraction: FC<SvgZoomInteractionProps> = memo(
  ({ chartArea, onDrag, onPinch, getCurrentTransform, className = '' }) => {
    const ref = useRef<SVGRectElement>(null!);

    useEffect(() => {
      const handler = (e: any) => e.preventDefault();
      document.addEventListener('gesturestart', handler);
      document.addEventListener('gesturechange', handler);
      document.addEventListener('gestureend', handler);
      return () => {
        document.removeEventListener('gesturestart', handler);
        document.removeEventListener('gesturechange', handler);
        document.removeEventListener('gestureend', handler);
      };
    }, []);

    const dragFrom = useCallback(() => {
      const transform = getCurrentTransform();
      return [transform.x, transform.y];
    }, [getCurrentTransform]);

    const pinchFrom = useCallback(() => {
      const transform = getCurrentTransform();
      return [transform.k];
    }, [getCurrentTransform]);

    useGesture(
      {
        onDrag: ({ pinching, cancel, offset: [x, y] }) => {
          if (pinching) {
            return cancel();
          }
          onDrag(x, y);
        },
        onPinch: ({ first, origin: [originX, originY], memo, offset: [k] }) => {
          let currentMemo = memo;
          if (first) {
            const { top, left } = ref.current.getBoundingClientRect();
            // Get pinch starting coord relative to the top left corner of the rect element.
            const relativePoint = [originX - left, originY - top] as [number, number];
            // Also store the inverted version of the starting coord.
            const currentTransform = getCurrentTransform();
            currentMemo = [relativePoint, currentTransform.invert(relativePoint)];
          }
          // let newTransform = updateScale(transform, k);
          let newTransform = new ZoomTransform(k, 0, 0);
          newTransform = updateTranslate(newTransform, currentMemo[0], currentMemo[1]);
          onPinch(newTransform);
          return currentMemo;
        }
      },
      {
        target: ref,
        //   drag: { from: () => [transform.x, transform.y], delay: false },
        drag: { from: dragFrom, delay: false },
        pinch: { from: pinchFrom, scaleBounds: { min: 0.5, max: 5 }, rubberband: true }
      }
    );

    return (
      <SvgGroup
        data-test-id="gesture-interaction"
        translateX={chartArea.translateLeft}
        translateY={chartArea.translateTop}
        className={className}
        fill="transparent"
        stroke="none"
      >
        <rect
          ref={ref}
          data-test-id="interaction-area"
          role="presentation"
          x={0}
          y={0}
          width={chartArea.width}
          height={chartArea.height}
        />
      </SvgGroup>
    );
  },
  (prevProps, nextProps) => prevProps.chartArea === nextProps.chartArea
);
