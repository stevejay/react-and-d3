import { ReactElement, useEffect, useLayoutEffect, useRef } from 'react';
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react';
import { ZoomTransform } from 'd3-zoom';

import { SvgGroup } from '@/components/SvgGroup';
import type { ChartArea } from '@/types';

const useGesture = createUseGesture([dragAction, pinchAction]);

function scale(transform: ZoomTransform, k: number): ZoomTransform {
  return k === transform.k ? transform : new ZoomTransform(k, transform.x, transform.y);
  //   zoomIdentity.translate(transform.x, transform.y).scale(k);
}

function translate(transform: ZoomTransform, p0: [number, number], p1: [number, number]): ZoomTransform {
  const x = p0[0] - p1[0] * transform.k;
  const y = p0[1] - p1[1] * transform.k;
  return x === transform.x && y === transform.y ? transform : new ZoomTransform(transform.k, x, y);
  //   zoomIdentity.translate(x, y).scale(transform.k);
}

export type SvgGestureInteractionProps = {
  chartArea: ChartArea;
  className?: string;
  transform: ZoomTransform;
  onChange: (change: ZoomTransform) => void;
};

// This works for both CategoryValueDatum and CategoryValueListDatum.
export function SvgGestureInteraction({
  chartArea,
  onChange,
  transform,
  className = ''
}: SvgGestureInteractionProps): ReactElement | null {
  const ref = useRef<SVGRectElement>(null!);

  const transformRef = useRef<ZoomTransform>();
  useLayoutEffect(() => {
    transformRef.current = transform;
  }); // run always

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

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) {
          return cancel();
        }
        onChange(new ZoomTransform(transform.k, x, y));
      },
      onPinch: ({ first, origin: [originX, originY], memo, offset: [s] }) => {
        let currentMemo = memo;
        if (first) {
          const { top, left } = ref.current.getBoundingClientRect();
          const relativePoint = [originX - left, originY - top] as [number, number];
          currentMemo = [relativePoint, transform.invert(relativePoint)] as const;
        }
        const nextTransform = translate(scale(transform, s), currentMemo[0], currentMemo[1]);
        onChange(nextTransform);
        return currentMemo;
      }
    },
    {
      target: ref,
      drag: { from: () => [transform.x, transform.y] },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true }
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
        className="touch-none"
        x={0}
        y={0}
        width={chartArea.width}
        height={chartArea.height}
      />
    </SvgGroup>
  );
}
