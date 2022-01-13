import { Children, cloneElement, FC, isValidElement } from 'react';
import { IntersectionOptions, useInView } from 'react-intersection-observer';
import useMeasure from 'react-use-measure';

const defaultIntersectOptions = { triggerOnce: true, rootMargin: '200px 0px' };

export type ChartSizerUsingCloneProps = {
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
};

export const ChartSizerUsingClone: FC<ChartSizerUsingCloneProps> = ({
  className,
  intersectOptions = defaultIntersectOptions,
  debouncedMeasureWaitMs = 300,
  children
}) => {
  const [inViewRef, inView] = useInView(intersectOptions);
  const [sizerRef, { width = 0, height = 0 }] = useMeasure({ debounce: debouncedMeasureWaitMs });
  const singleChild = Children.only(children);
  let hydratedChild;

  if (singleChild && inView) {
    hydratedChild = isValidElement(singleChild) ? cloneElement(singleChild, { width, height }) : singleChild;
  }

  return (
    <div ref={sizerRef} className={`relative overflow-hidden w-full ${className}`}>
      <div ref={inViewRef}>{inView && hydratedChild}</div>
    </div>
  );
};
