import { useRef } from 'react';
import { SpringConfig, SpringValue, useSpring } from 'react-spring';

export function useSwipedPathTransitions({
  offset,
  pathShape,
  springConfig,
  animate
}: {
  offset: number;
  pathShape: string;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
}): { offset: SpringValue<number> } {
  // Keep track of the last path shape to be animated:
  const currentPathShape = useRef<string>(pathShape);
  return useSpring({
    from: { offset },
    to: { offset: 0 },
    // Reset the animation when the shape updates:
    reset: currentPathShape.current !== pathShape,
    onChange: () => {
      currentPathShape.current = pathShape;
    },
    config: springConfig,
    immediate: !animate
  });
}
