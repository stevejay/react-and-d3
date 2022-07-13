import { useMemo, useRef } from 'react';
import { Interpolation, SpringConfig, to, useSpring } from 'react-spring';
import { interpolatePath } from 'd3-interpolate-path';
import { CurveFactory, CurveFactoryLineOnly } from 'd3-shape';

import { createLineSeriesPositioning } from '../positioning';
import { ScaleInput } from '../scale';
import { PositionScale } from '../types';

// Approach for interpolating the line is from
// https://codesandbox.io/s/react-spring-d3-interpolate-path-nz85r?file=/src/App.js

export function useLineSeriesTransitions<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  data: readonly Datum[],
  xScale: XScale,
  yScale: YScale,
  // keyAccessor: (datum: Datum) => string,
  xAccessor: (datum: Datum) => ScaleInput<XScale>,
  yAccessor: (datum: Datum) => ScaleInput<YScale>,
  horizontal: boolean,
  curve?: CurveFactory | CurveFactoryLineOnly,
  springConfig?: Partial<SpringConfig>,
  animate?: boolean,
  renderingOffset?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Interpolation<string, any> {
  // use d3-interpolate-path to interpolate even with different points
  const path = createLineSeriesPositioning({
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    horizontal,
    curve,
    renderingOffset
  });
  const pathD = path(data) || '';

  // keep track of last used pathD to interpolate from
  const currD = useRef<string>(pathD);

  // create an interpolator that maps from t (0 to 1) to a path d string
  const pathInterpolator = useMemo(() => interpolatePath(currD.current, pathD), [pathD]);

  // create a spring that maps from t = 0 (start animation) to t = 1 (end of animation)
  const springProps = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    // reset t to 0 when the path changes so we can begin interpolating anew
    reset: currD.current !== pathD,
    // when t updates, update the last seen D so we can handle interruptions
    onChange: ({ value: { t } }) => {
      currD.current = pathInterpolator(t);
    },
    config: springConfig,
    immediate: !animate
  });

  return to(springProps.t, pathInterpolator);

  // return { springProps, pathInterpolator, foo: to(springProps.t, pathInterpolator) };
}
