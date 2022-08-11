import { useMemo, useRef } from 'react';
import { Interpolation, SpringConfig, to, useSpring } from 'react-spring';
import { interpolatePath } from 'd3-interpolate-path';

// Approach for interpolating the line is from
// https://codesandbox.io/s/react-spring-d3-interpolate-path-nz85r?file=/src/App.js

export function useLineInterpolationTransitions({
  pathD,
  springConfig,
  animate
}: {
  pathD: string;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
}): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Interpolation<string, any> {
  // keep track of last used pathD to interpolate from
  const currentPathD = useRef<string>(pathD);
  // create an interpolator that maps from t (0 to 1) to a path d string
  const pathInterpolator = useMemo(() => interpolatePath(currentPathD.current, pathD), [pathD]);
  // create a spring that maps from t = 0 (start animation) to t = 1 (end of animation)
  const springProps = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    // reset t to 0 when the path changes so we can begin interpolating anew
    reset: currentPathD.current !== pathD,
    // when t updates, update the last seen D so we can handle interruptions
    onChange: ({ value: { t } }) => {
      currentPathD.current = pathInterpolator(t);
    },
    config: springConfig,
    immediate: !animate
  });

  return to(springProps.t, pathInterpolator);
}
