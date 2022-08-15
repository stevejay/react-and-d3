import { ReactNode, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { barGroupEventSource, xyChartEventSource } from './constants';
import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { isDefined } from './isDefined';
import { SVGBarSeriesProps } from './SVGBarSeries';
import { SVGBarSeriesRenderer } from './SVGBarSeriesRenderer';
import type { AxisScale, RenderAnimatedBarProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useSeriesTransitions } from './useSeriesTransitions';
import { useXYChartContext } from './useXYChartContext';

type SVGBarGroupProps<Datum extends object> = {
  springConfig?: SpringConfig;
  animate?: boolean;
  /** Comparator function to sort `dataKeys` within a bar group. By default the DOM rendering order of `BarGroup`s `children` is used. */
  sort?: (dataKeyA: string, dataKeyB: string) => number;
  children?: ReactNode;
  /** Group band scale padding, [0, 1] where 0 = no padding, 1 = no bar. */
  padding?: number;
  /** Optional color accessor that overrides any color accessor on the group's children. */
  colorAccessor?: (datum: Datum, dataKey: string) => string;
  // component?: SVGBarComponent<Datum>;
  enableEvents?: boolean;
  renderBar: (props: RenderAnimatedBarProps<Datum>) => ReactNode;
};

export function SVGBarGroup<Datum extends object>({
  children,
  springConfig,
  animate = true,
  colorAccessor,
  renderBar,
  enableEvents = true
}: SVGBarGroupProps<Datum>) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useXYChartContext<Datum, any>();

  const barSeriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<SVGBarSeriesProps<Datum>>(children),
    [children]
  );
  const dataKeys = barSeriesChildren.map((child) => child.props.dataKey).filter(isDefined);

  const ownEventSourceKey = `${barGroupEventSource}-${dataKeys.join('-')}}`;
  /* const eventEmitters =  */ useSeriesEvents<AxisScale, AxisScale, Datum>({
    dataKeyOrKeysRef: dataKeys,
    enableEvents,
    // onBlur,
    // onFocus,
    // onPointerMove,
    // onPointerOut,
    // onPointerUp,
    source: ownEventSourceKey,
    allowedSources: [xyChartEventSource, ownEventSourceKey]
  });

  const transitions = useSeriesTransitions(
    dataKeys.map((dataKey) => dataEntryStore.getByDataKey(dataKey)),
    springConfig ?? contextSpringConfig,
    animate && contextAnimate
  );

  return (
    <>
      {transitions((styles, datum) => {
        const child = barSeriesChildren.find((child) => child.props.dataKey === datum.dataKey);
        const { groupProps, dataKey } = child?.props ?? {};
        const { style, ...restGroupProps } = groupProps ?? {};
        return (
          <animated.g
            data-testid={`bar-group-series-${dataKey}`}
            style={{ ...style, ...styles }}
            {...restGroupProps}
          >
            <SVGBarSeriesRenderer
              scales={scales}
              dataEntry={datum}
              horizontal={horizontal}
              renderingOffset={renderingOffset}
              animate={animate && contextAnimate}
              springConfig={springConfig ?? contextSpringConfig}
              colorAccessor={colorAccessor ?? datum.colorAccessor}
              // colorScale={scales.color}
              // {...events}
              renderBar={renderBar}
              seriesIsLeaving={!dataKeys.includes(datum.dataKey)}
            />
          </animated.g>
        );
      })}
    </>
  );
}
