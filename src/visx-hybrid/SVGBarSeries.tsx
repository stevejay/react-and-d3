import type { SVGProps } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { BARSERIES_EVENT_SOURCE, defaultShapeRendering, XYCHART_EVENT_SOURCE } from './constants';
import type { AxisScale, PositionScale, ScaleInput } from './types';
import { useBarSeriesTransitions } from './useBarSeriesTransitions';
import { useDataContext } from './useDataContext';
import { useSeriesEvents } from './useSeriesEvents';

type PolygonProps = Omit<SVGProps<SVGPolygonElement>, 'points' | 'ref'>;
type LineProps = Omit<SVGProps<SVGLineElement>, 'x1' | 'y1' | 'x2' | 'y2' | 'ref'>;

type SVGBarSeriesProps<Datum extends object> = {
  springConfig?: SpringConfig;
  animate?: boolean;
  dataKey: string;
  data: readonly Datum[];
  keyAccessor: (d: Datum, dataKey?: string) => string;
  independentAccessor: (d: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (d: Datum) => ScaleInput<AxisScale>;
  colorAccessor?: (d: Datum, dataKey: string) => string;
  groupProps?: SVGProps<SVGGElement>;
  barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps);
  lineProps?: LineProps | ((datum: Datum, index: number, dataKey: string) => LineProps);
};

export function SVGBarSeries<Datum extends object>({
  groupProps,
  springConfig,
  animate = true,
  dataKey,
  barProps,
  lineProps
}: SVGBarSeriesProps<Datum>) {
  const {
    horizontal,
    independentScale,
    dependentScale,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntries
  } = useDataContext();
  const dataEntry = dataEntries.find((dataEntry) => dataEntry.dataKey === dataKey);
  if (!dataEntry) {
    throw new Error(`Could not find data for dataKey '${dataKey}'`);
  }
  const { independentAccessor, dependentAccessor, data, keyAccessor, colorAccessor } = dataEntry;
  const ownEventSourceKey = `${BARSERIES_EVENT_SOURCE}-${dataKey}`;
  // const eventEmitters =
  useSeriesEvents<AxisScale, AxisScale, Datum>({
    dataKey,
    enableEvents: true,
    // onBlur,
    // onFocus,
    // onPointerMove,
    // onPointerOut,
    // onPointerUp,
    source: ownEventSourceKey,
    allowedSources: [XYCHART_EVENT_SOURCE]
  });
  const transitions = useBarSeriesTransitions(
    data,
    (horizontal ? dependentScale : independentScale) as PositionScale,
    (horizontal ? independentScale : dependentScale) as PositionScale,
    keyAccessor,
    horizontal ? dependentAccessor : independentAccessor,
    horizontal ? independentAccessor : dependentAccessor,
    horizontal,
    springConfig ?? contextSpringConfig,
    animate && contextAnimate,
    renderingOffset
  );
  return (
    <g data-testid={`bar-series-${dataKey}`} {...groupProps}>
      {transitions(({ opacity, x1, y1, x2, y2, points }, datum, _, index) => {
        const {
          style: barStyle,
          fill,
          ...restBarProps
        } = (typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps) ?? {};
        const { style: lineStyle, ...restLineProps } =
          (typeof lineProps === 'function' ? lineProps(datum, index, dataKey) : lineProps) ?? {};
        return (
          <>
            <animated.polygon
              data-testid="bar"
              points={points}
              fill={colorAccessor?.(datum, dataKey) ?? fill}
              style={{ ...barStyle, opacity }}
              shapeRendering={defaultShapeRendering}
              {...restBarProps}
              // {...eventEmitters}
            />
            <animated.line
              x1={x1}
              y1={y1}
              x2={horizontal ? x1 : x2}
              y2={horizontal ? y2 : y1}
              style={{ ...lineStyle, opacity }}
              shapeRendering={defaultShapeRendering}
              stroke="currenColor"
              strokeWidth={1}
              strokeLinecap="butt"
              {...restLineProps}
            />
          </>
        );
      })}
    </g>
  );
}
