import { SVGProps } from 'react';
import { animated } from 'react-spring';

import { PositionScale } from '@/visx-next/types';

import { BarSeriesRendererProps } from './SVGBarSeries';
import { useBarSeriesTransitions } from './useBarSeriesTransitions';

export function SVGFancyBarSeriesRenderer<Datum extends object>({
  data,
  dataKey,
  keyAccessor,
  dependentAccessor,
  independentAccessor,
  colorAccessor,
  springConfig,
  animate = true,
  context: { horizontal, independentScale, dependentScale, renderingOffset },
  barProps
}: BarSeriesRendererProps<
  {
    barProps?:
      | Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>
      | ((
          datum: Datum,
          index: number,
          dataKey: string
        ) => Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>);
  },
  Datum
>) {
  const transitions = useBarSeriesTransitions(
    data,
    (horizontal ? dependentScale : independentScale) as PositionScale,
    (horizontal ? independentScale : dependentScale) as PositionScale,
    keyAccessor,
    horizontal ? dependentAccessor : independentAccessor,
    horizontal ? independentAccessor : dependentAccessor,
    horizontal,
    springConfig,
    animate,
    renderingOffset
  );
  return (
    <>
      {transitions(({ opacity, x, y, x2, y2, width, height }, datum, _, index) => {
        const { style, ...restBarProps } =
          (typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps) ?? {};
        return (
          <>
            <animated.rect
              data-test-id="bar"
              x={x}
              y={y}
              width={width}
              height={height}
              fill={colorAccessor?.(datum, dataKey) ?? restBarProps.fill}
              style={{ ...style, opacity }}
              shapeRendering="crispEdges"
              {...restBarProps}
              // {...eventEmitters}
            />
            <animated.line
              x1={horizontal ? x2 : x}
              y1={y}
              x2={x2}
              y2={horizontal ? y2 : y}
              stroke="white"
              strokeWidth={2}
              strokeLinecap="butt"
            />
          </>
        );
      })}
    </>
  );
}
