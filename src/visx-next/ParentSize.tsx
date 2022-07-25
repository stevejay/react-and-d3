import { ReactNode } from 'react';
import useMeasure, { RectReadOnly } from 'react-use-measure';

export interface ParentSizeProps {
  /**
   * For applying extra classes to the wrapper <div> element. Optional.
   */
  className?: string;
  /**
   * The debounce time to observe when the chart is changing size.
   * Defaults to 300 ms.
   */
  debouncedMeasureWaitMs?: number;
  /**
   * Render prop for the chart. The child component will be passed the
   * measured dimensions. If the `width` or `height` is zero or nil then
   * the chart should not be rendered.
   *
   * Note: Knowing bounds is only possible *after* the view renders
   * so you'll get zero values on the first run and then be informed
   * in a later render.
   */
  children: (dimensions: RectReadOnly) => ReactNode;
}

/**
 * Allows the rendered chart to be sized to the available space in this component's parent element.
 */
export function ParentSize({ className = '', debouncedMeasureWaitMs = 0, children }: ParentSizeProps) {
  const [measureRef, dimensions] = useMeasure({ debounce: debouncedMeasureWaitMs });
  return (
    <div ref={measureRef} style={{ width: '100%', height: '100%' }} className={className}>
      {children(dimensions)}
    </div>
  );
}
