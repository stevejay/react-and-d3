import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { SeriesPoint } from 'd3-shape';

// import { DataRegistry } from '../DataRegistry';
// import { DataRegistry } from '../DataRegistry';
import { createBarStackPositioning } from '../positioning';
import { ScaleInput } from '../scale';
import { CombinedStackData, PositionScale } from '../types';

export function useBarStackTransitions<XScale extends PositionScale, YScale extends PositionScale>(
  data: readonly SeriesPoint<CombinedStackData<XScale, YScale>>[],
  dataKeys: readonly string[],
  xScale: XScale,
  yScale: YScale,
  dataKey: string,
  xAccessor: (d: SeriesPoint<CombinedStackData<XScale, YScale>>) => ScaleInput<XScale>,
  yAccessor: (d: SeriesPoint<CombinedStackData<XScale, YScale>>) => ScaleInput<YScale>,
  // dataRegistry: Omit<
  //   DataRegistry<XScale, YScale, SeriesPoint<CombinedStackData<XScale, YScale>>>,
  //   'registry' | 'registryKeys'
  // >,
  // keyAccessor: (datum: Datum) => Key,
  horizontal: boolean,
  //   fallbackBandwidth: number,
  springConfig?: Partial<SpringConfig>,
  animate?: boolean,
  renderingOffset?: number
) {
  const position = createBarStackPositioning(xScale, yScale, horizontal, renderingOffset);

  const previousPositionRef = useRef<typeof position | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  });

  // const scaleIsBandScale = isBandScale(horizontal ? yScale : xScale);
  // const { xAccessor, yAccessor } = dataRegistry.get(dataKey); // TODO not sure about this.

  return useTransition<
    SeriesPoint<CombinedStackData<XScale, YScale>>,
    { x: number; y: number; width: number; height: number; opacity: number }
  >(data, {
    initial: (datum) => ({ opacity: 1, ...position(datum, dataKey) }),
    from: (datum) => {
      return { opacity: 0, ...position(datum, dataKey) };
    },
    // from: (datum) => {
    //   if (scaleIsBandScale) {
    //     return { opacity: 0, ...position(datum, dataKey) };
    //   }
    //   const initialPosition = previousPositionRef.current
    //     ? previousPositionRef.current(datum, dataKey)
    //     : null;
    //   return !isNil(initialPosition)
    //     ? { opacity: 0, ...initialPosition }
    //     : { opacity: 0, ...position(datum, dataKey) };
    // },
    enter: (datum) => ({ opacity: 1, ...position(datum, dataKey) }),
    // update: (datum) => {
    //   return { opacity: 1, ...position(datum, dataKey) }
    // },
    update: (datum) =>
      dataKeys.includes(dataKey) ? { opacity: 1, ...position(datum, dataKey) } : { opacity: 1 },
    leave: () => ({ opacity: 0 }),
    // leave: (datum) => {
    //   if (scaleIsBandScale) {
    //     return { opacity: 0 };
    //   }
    //   const exitPosition = position(datum, dataKey);
    //   return !isNil(exitPosition) ? { opacity: 0, ...position(datum, dataKey) } : { opacity: 0 };
    // },
    config: springConfig,
    keys: (datum) => `${dataKey}-${(horizontal ? yAccessor : xAccessor)?.(datum)}`,
    immediate: !animate
  });
}
