import { SpringConfig, useTransition } from 'react-spring';

// import { createBarSeriesPositioning } from '@/visx-next/positioning';
import { ScaleInput } from '@/visx-next/scale';
import { PositionScale } from '@/visx-next/types';

import { createBarSeriesPolygonPositioning } from './barSeriesPolygonPositioning';

// export function useBarSeriesTransitions<Datum extends object>(
//   data: readonly Datum[],
//   xScale: PositionScale,
//   yScale: PositionScale,
//   keyAccessor: (datum: Datum) => string,
//   xAccessor: (datum: Datum) => ScaleInput<PositionScale>,
//   yAccessor: (datum: Datum) => ScaleInput<PositionScale>,
//   horizontal: boolean,
//   springConfig?: Partial<SpringConfig>,
//   animate?: boolean,
//   renderingOffset?: number
// ) {
//   const position = createBarSeriesPositioning(
//     xScale,
//     yScale,
//     xAccessor,
//     yAccessor,
//     horizontal,
//     renderingOffset
//   );
//   return useTransition<
//     Datum,
//     { x: number; y: number; x2: number; y2: number; width: number; height: number; opacity: number }
//   >(data, {
//     initial: (datum) => ({ opacity: 1, ...position(datum) }),
//     from: (datum) => ({ opacity: 0, ...position(datum) }),
//     enter: (datum) => ({ opacity: 1, ...position(datum) }),
//     update: (datum) => ({ opacity: 1, ...position(datum) }),
//     leave: () => ({ opacity: 0 }),
//     config: springConfig,
//     keys: keyAccessor,
//     immediate: !animate
//   });
// }

export function useBarSeriesTransitions<Datum extends object>(
  data: readonly Datum[],
  xScale: PositionScale,
  yScale: PositionScale,
  keyAccessor: (datum: Datum) => string,
  xAccessor: (datum: Datum) => ScaleInput<PositionScale>,
  yAccessor: (datum: Datum) => ScaleInput<PositionScale>,
  horizontal: boolean,
  springConfig?: Partial<SpringConfig>,
  animate?: boolean,
  renderingOffset?: number
) {
  const position = createBarSeriesPolygonPositioning(
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    horizontal,
    renderingOffset
  );
  return useTransition<
    Datum,
    {
      points: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
      opacity: number;
    }
  >(data, {
    initial: (datum) => ({ opacity: 1, ...position(datum) }),
    from: (datum) => ({ opacity: 0, ...position(datum) }),
    enter: (datum) => ({ opacity: 1, ...position(datum) }),
    update: (datum) => ({ opacity: 1, ...position(datum) }),
    leave: () => ({ opacity: 0 }),
    config: springConfig,
    keys: keyAccessor,
    immediate: !animate
  });
}
