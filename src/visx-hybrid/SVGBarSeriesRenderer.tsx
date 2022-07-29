import { SVGProps } from 'react';
import { animated } from 'react-spring';

import { PositionScale } from '@/visx-next/types';

import { BarSeriesRendererProps } from './SVGBarSeries';
import { useBarSeriesTransitions } from './useBarSeriesTransitions';

type PolygonProps = Omit<SVGProps<SVGPolygonElement>, 'points' | 'ref'>;

export function SVGBarSeriesRenderer<Datum extends object>({
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
  { barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps) },
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
      {transitions(({ opacity, points }, datum, _, index) => {
        const { style, fill, ...restBarProps } =
          (typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps) ?? {};
        return (
          <animated.polygon
            data-testid="bar"
            points={points}
            fill={colorAccessor?.(datum, dataKey) ?? fill}
            style={{ ...style, opacity }}
            shapeRendering="crispEdges"
            {...restBarProps}
            // {...eventEmitters}
          />
        );
      })}
    </>
  );
  // return (
  //   <>
  //     {transitions(({ opacity, x, y, width, height }, datum, _, index) => {
  //       const { style, ...restBarProps } =
  //         (typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps) ?? {};
  //       return (
  //         <animated.rect
  //           data-testid="bar"
  //           x={x}
  //           y={y}
  //           width={width}
  //           height={height}
  //           fill={colorAccessor?.(datum, dataKey) ?? restBarProps.fill}
  //           style={{ ...style, opacity }}
  //           shapeRendering="crispEdges"
  //           {...restBarProps}
  //           // {...eventEmitters}
  //         />
  //       );
  //     })}
  //   </>
  // );
}
