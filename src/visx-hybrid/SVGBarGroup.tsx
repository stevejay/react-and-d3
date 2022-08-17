import { ReactNode, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { barGroupEventSource, xyChartEventSource } from './constants';
import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { isDefined } from './isDefined';
import { SVGBarSeriesProps } from './SVGBarSeries';
import { SVGBarSeriesRenderer } from './SVGBarSeriesRenderer';
import type { BasicSeriesProps, RenderAnimatedBarProps } from './types';
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
} & Pick<BasicSeriesProps<Datum>, 'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus'>;

export function SVGBarGroup<Datum extends object>({
  children,
  springConfig,
  animate = true,
  colorAccessor,
  renderBar,
  enableEvents = true,
  onBlur,
  onFocus,
  onPointerMove,
  onPointerOut,
  onPointerUp
}: SVGBarGroupProps<Datum>) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore
  } = useXYChartContext<Datum>();

  const barSeriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<SVGBarSeriesProps<Datum>>(children),
    [children]
  );
  const dataKeys = barSeriesChildren.map((child) => child.props.dataKey).filter(isDefined);

  const ownEventSourceKey = `${barGroupEventSource}-${dataKeys.join('-')}}`;
  const eventEmitters = useSeriesEvents<Datum>({
    dataKeyOrKeysRef: dataKeys,
    enableEvents,
    onBlur,
    onFocus,
    onPointerMove,
    onPointerOut,
    onPointerUp,
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
              renderBar={renderBar}
              seriesIsLeaving={!dataKeys.includes(datum.dataKey)}
              {...eventEmitters}
            />
          </animated.g>
        );
      })}
    </>
  );
}
