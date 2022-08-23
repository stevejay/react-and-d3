import { ReactNode, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { barStackEventSource, xyChartEventSource } from './constants';
import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { isDefined } from './isDefined';
import { STACK_OFFSETS } from './stackOffset';
import { STACK_ORDERS } from './stackOrder';
import { SVGBarSeriesProps } from './SVGBarSeries';
import { SVGBarSeriesRenderer } from './SVGBarSeriesRenderer';
import type { BasicSeriesProps, RenderAnimatedBarProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useSeriesTransitions } from './useSeriesTransitions';
import { useXYChartContext } from './useXYChartContext';

export type SVGBarStackProps<Datum extends object> = {
  /** Sets the stack offset to the pre-defined d3 offset, see https://github.com/d3/d3-shape#stack_offset. */
  stackOffset?: keyof typeof STACK_OFFSETS;
  /** Sets the stack order to the pre-defined d3 function, see https://github.com/d3/d3-shape#stack_order. */
  stackOrder?: keyof typeof STACK_ORDERS;
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  enableEvents?: boolean;
  children?: ReactNode;
  colorAccessor?: (datum: Datum) => string;
  renderBar: (props: RenderAnimatedBarProps<Datum>) => ReactNode;
} & Pick<
  BasicSeriesProps<Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerDown' | 'onPointerUp' | 'onBlur' | 'onFocus'
>;

export function SVGBarStack<Datum extends object>({
  children,
  enableEvents = true,
  animate = true,
  springConfig,
  colorAccessor,
  renderBar,
  onBlur,
  onFocus,
  onPointerMove,
  onPointerDown,
  onPointerOut,
  onPointerUp
}: SVGBarStackProps<Datum>) {
  const {
    horizontal,
    scales,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore
  } = useXYChartContext<Datum>();
  const seriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<SVGBarSeriesProps<Datum>>(children),
    [children]
  );
  const dataKeys = seriesChildren.map((child) => child.props.dataKey).filter(isDefined);
  const ownEventSourceKey = `${barStackEventSource}-${dataKeys.join('-')}`;
  const eventEmitters = useSeriesEvents<Datum>({
    dataKeyOrKeysRef: dataKeys,
    enableEvents,
    onBlur,
    onFocus,
    onPointerMove,
    onPointerDown,
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
      {transitions((styles, dataEntry) => {
        const child = seriesChildren.find((child) => child.props.dataKey === dataEntry.dataKey);
        const { groupProps } = child?.props ?? {};
        const { style, ...restGroupProps } = groupProps ?? {};
        return (
          <animated.g
            data-testid={`bar-stack-series-${dataEntry.dataKey}`}
            style={{ ...style, ...styles }}
            {...restGroupProps}
          >
            <SVGBarSeriesRenderer
              scales={scales}
              dataEntry={dataEntry}
              horizontal={horizontal}
              renderingOffset={renderingOffset}
              animate={animate && contextAnimate}
              springConfig={springConfig ?? contextSpringConfig}
              colorAccessor={colorAccessor ?? dataEntry.colorAccessor}
              renderBar={renderBar}
              {...eventEmitters}
            />
          </animated.g>
        );
      })}
    </>
  );
}
