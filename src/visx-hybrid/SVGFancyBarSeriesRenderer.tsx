import { SVGProps } from 'react';
import { animated } from 'react-spring';

import { PositionScale } from '@/visx-next/types';

import { BarSeriesRendererProps } from './SVGBarSeries';
import { useBarSeriesTransitions } from './useBarSeriesTransitions';

type PolygonProps = Omit<SVGProps<SVGPolygonElement>, 'points' | 'ref'>;
type LineProps = Omit<SVGProps<SVGLineElement>, 'x1' | 'y1' | 'x2' | 'y2' | 'ref'>;

export function SVGFancyBarSeriesRenderer<Datum extends object>({
  data,
  dataKey,
  keyAccessor,
  dependentAccessor,
  independentAccessor,
  colorAccessor,
  springConfig,
  animate = true,
  context,
  barProps,
  lineProps
}: BarSeriesRendererProps<
  {
    barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps);
    lineProps?: LineProps | ((datum: Datum, index: number, dataKey: string) => LineProps);
  },
  Datum
>) {
  const { horizontal, independentScale, dependentScale, renderingOffset } = context;
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
      {transitions(({ opacity, x1, y1, x2, y2, points }, datum, _, index) => {
        const {
          style: barPropsStyle,
          fill,
          ...restBarProps
        } = (typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps) ?? {};
        const { style: linePropsStyle, ...restLineProps } =
          (typeof lineProps === 'function' ? lineProps(datum, index, dataKey) : lineProps) ?? {};
        return (
          <>
            <animated.polygon
              data-test-id="bar"
              points={points}
              fill={colorAccessor?.(datum, dataKey) ?? fill}
              style={{ ...barPropsStyle, opacity }}
              shapeRendering="crispEdges"
              {...restBarProps}
              // {...eventEmitters}
            />
            <animated.line
              x1={x1}
              y1={y1}
              x2={horizontal ? x1 : x2}
              y2={horizontal ? y2 : y1}
              style={{ ...linePropsStyle, opacity }}
              shapeRendering="crispEdges"
              stroke="currenColor"
              strokeWidth={1}
              strokeLinecap="butt"
              {...restLineProps}
            />
          </>
        );
      })}
    </>
  );
}
