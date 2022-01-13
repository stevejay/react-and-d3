import { FC, ReactNode } from 'react';
import { IntersectionOptions, useInView } from 'react-intersection-observer';
import useMeasure from 'react-use-measure';

const defaultIntersectOptions = { triggerOnce: true, rootMargin: '200px 0px' };

export type ChartSizerProps = {
  /**
   * Use this to apply a height class to the chart sizer, e.g., `h-96`.
   * Required.
   */
  className: string;
  /**
   * The debounce time to observe when the chart is changing size.
   */
  debouncedMeasureWaitMs?: number;
  /**
   * Options for the underlying `react-intersection-observer` hook.
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
};

/**
 * Controls the size of the contained chart and only renders it if it
 * is in the viewport.
 */
export const ChartSizer: FC<ChartSizerProps> = ({
  className,
  intersectOptions = defaultIntersectOptions,
  debouncedMeasureWaitMs = 300,
  children
}) => {
  const [inViewRef, inView] = useInView(intersectOptions);
  const [sizerRef, { width, height }] = useMeasure({ debounce: debouncedMeasureWaitMs });
  return (
    <div ref={sizerRef} className={`relative overflow-hidden w-full ${className}`}>
      <div ref={inViewRef}>{children({ inView, width: width ?? 0, height: height ?? 0 })}</div>
    </div>
  );
};
