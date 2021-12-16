import useMeasure from 'react-use-measure';

/** A facade around useMeasure. */
export const useDebouncedMeasure = (
  wait = 300
): { ref: ReturnType<typeof useMeasure>[0]; width?: number; height?: number } => {
  const [ref, bounds] = useMeasure({ debounce: wait });
  return { ref, width: bounds.width, height: bounds.height };
};
