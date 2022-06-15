import { ReactNode } from 'react';
import { IntersectionOptions, useInView } from 'react-intersection-observer';

const defaultIntersectOptions = { triggerOnce: true, rootMargin: '200px 0px' };

export interface InViewProps {
  /**
   * For applying extra classes to the <div> wrapper element. Optional.
   */
  className?: string;
  /**
   * Options for the underlying `react-intersection-observer` hook.
   * Defaults to `{ triggerOnce: true, rootMargin: '200px 0px' }`.
   */
  intersectOptions?: IntersectionOptions;
  /**
   * The children to wrap. Will not be rendered if the `inView` value returned by
   * the underlying `react-intersection-observer` hook is false.
   */
  children: ReactNode;
}

/**
 * Only renders the component children if this component is visible in the viewport.
 */
export function InView({
  className = '',
  intersectOptions = defaultIntersectOptions,
  children
}: InViewProps) {
  const [inViewRef, inView] = useInView(intersectOptions);
  return (
    <div ref={inViewRef} style={{ width: '100%', height: '100%' }} className={className}>
      {inView ? children : null}
    </div>
  );
}
