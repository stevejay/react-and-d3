import { useMemo, useRef } from 'react';
import { Interpolation, SpringConfig, to, useSpring } from 'react-spring';
import { interpolatePath } from 'd3-interpolate-path';

// Approach for interpolating the line is from
// https://codesandbox.io/s/react-spring-d3-interpolate-path-nz85r?file=/src/App.js

export function useInterpolatedPathTransitions({
  pathShape,
  springConfig,
  animate
}: {
  pathShape: string;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
}): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Interpolation<string, any> {
  // Keep track of last used pathD to interpolate from:
  const currentPathShape = useRef<string>(pathShape);
  // Create an interpolator that maps from t (0 to 1) to a path d string:
  const pathInterpolator = useMemo(() => interpolatePath(currentPathShape.current, pathShape), [pathShape]);
  // Create a spring that maps from t = 0 (start animation) to t = 1 (end of animation):
  const springProps = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    // Reset t to 0 when the path changes so we can begin interpolating again:
    reset: currentPathShape.current !== pathShape,
    // When t updates, update the last seen path shape so we can handle interruptions:
    onChange: ({ value: { t } }) => {
      currentPathShape.current = pathInterpolator(t);
    },
    config: springConfig,
    immediate: !animate
  });
  return to(springProps.t, pathInterpolator);
}
