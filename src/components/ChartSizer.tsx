import { ReactNode } from 'react';
import { IntersectionOptions, useInView } from 'react-intersection-observer';
import useMeasure from 'react-use-measure';

const defaultIntersectOptions = { triggerOnce: true, rootMargin: '200px 0px' };

export interface ChartSizerProps {
  /**
   * Use this to apply a height to the chart sizer, e.g., `h-96`.
   * Required.
   */
  className: string;
  /**
   * The debounce time to observe when the chart is changing size.
   * Defaults to 300 ms.
   */
  debouncedMeasureWaitMs?: number;
  /**
   * Options for the underlying `react-intersection-observer` hook. Optional.
   */
  intersectOptions?: IntersectionOptions;
  /**
   * Render prop for the chart. The child component will be passed the current
   * `width` and `height` that the chart should render as. Either or both could be
   * zero, in which case the chart should not be rendered. The `inView` property
   * indicates if the chart is currently in the viewport or not. You might choose
   * to not render the chart if it is not currently visible.
   */
  children: ({ inView, width, height }: { inView: boolean; width: number; height: number }) => ReactNode;
}

/**
 * Controls the size of the contained chart and allows you to only render it
 * if it is currently within the viewport.
 */
export function ChartSizer({
  className,
  intersectOptions = defaultIntersectOptions,
  debouncedMeasureWaitMs = 300,
  children
}: ChartSizerProps) {
  const [inViewRef, inView] = useInView(intersectOptions);
  const [sizerRef, { width, height }] = useMeasure({ debounce: debouncedMeasureWaitMs });
  return (
    <div ref={sizerRef} className={`relative overflow-hidden w-full ${className}`}>
      <div ref={inViewRef}>{children({ inView, width: width ?? 0, height: height ?? 0 })}</div>
    </div>
  );
}
