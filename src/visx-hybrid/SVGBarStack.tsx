import { ReactNode, useCallback, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { BARSTACK_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './constants';
import findNearestStackDatum from './findNearestStackDatum';
import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { STACK_OFFSETS } from './stackOffset';
import { STACK_ORDERS } from './stackOrder';
import { SVGBarSeriesProps } from './SVGBarSeries';
import { SVGBarStackSeries } from './SVGBarStackSeries';
import type { AxisScale, NearestDatumArgs, NearestDatumReturnType, StackDatum, SVGBarProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useSeriesTransitions } from './useSeriesTransitions';
import { useXYChartContext } from './useXYChartContext';

export interface SVGBarStackProps<Datum extends object> {
  /** Sets the stack offset to the pre-defined d3 offset, see https://github.com/d3/d3-shape#stack_offset. */
  stackOffset?: keyof typeof STACK_OFFSETS;
  /** Sets the stack order to the pre-defined d3 function, see https://github.com/d3/d3-shape#stack_order. */
  stackOrder?: keyof typeof STACK_ORDERS;
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  enableEvents?: boolean;
  children?: ReactNode;
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
  colorAccessor?: (datum: Datum, key: string) => string;
}

export function SVGBarStack<Datum extends object>({
  children,
  enableEvents = true,
  animate = true,
  springConfig,
  colorAccessor,
  component
}: SVGBarStackProps<Datum>) {
  const {
    horizontal,
    scales,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    colorScale,
    dataEntryStore
  } = useXYChartContext();

  const seriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<SVGBarSeriesProps<Datum>>(children),
    [children]
  );

  const dataKeys = seriesChildren.map((child) => child.props.dataKey).filter((key) => key);

  // custom logic to find the nearest AreaStackDatum (context) and return the original Datum (props)
  const findNearestDatum = useCallback(
    (params: NearestDatumArgs<StackDatum<AxisScale, AxisScale, Datum>>): NearestDatumReturnType<Datum> => {
      const childData = seriesChildren.find((child) => child.props.dataKey === params.dataKey)?.props?.data;
      return childData ? findNearestStackDatum(params, childData, horizontal) : null;
    },
    [seriesChildren, horizontal]
  );

  const ownEventSourceKey = `${BARSTACK_EVENT_SOURCE}-${dataKeys.join('-')}`;

  // TODO fix the any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /* const eventEmitters = */ useSeriesEvents<AxisScale, AxisScale, any>({
    dataKeyOrKeysRef: dataKeys,
    enableEvents,
    findNearestDatum,
    // onBlur,
    // onFocus,
    // onPointerMove,
    // onPointerOut,
    // onPointerUp,
    source: ownEventSourceKey,
    allowedSources: [XYCHART_EVENT_SOURCE, ownEventSourceKey]
  });

  const transitions = useSeriesTransitions(
    dataKeys.map((dataKey) => dataEntryStore.getByDataKey(dataKey)),
    springConfig ?? contextSpringConfig,
    animate && contextAnimate
  );

  return (
    <>
      {transitions((styles, datum) => {
        const child = seriesChildren.find((child) => child.props.dataKey === datum.dataKey);
        const { groupProps } = child?.props ?? {};
        const { style, ...restGroupProps } = groupProps ?? {};
        return (
          <animated.g
            data-testid={`bar-stack-series-${datum.dataKey}`}
            style={{ ...style, ...styles }}
            {...restGroupProps}
          >
            <SVGBarStackSeries
              dataKey={datum.dataKey}
              scales={scales}
              dataEntry={datum}
              horizontal={horizontal}
              renderingOffset={renderingOffset}
              animate={animate && contextAnimate}
              springConfig={springConfig ?? contextSpringConfig}
              colorAccessor={colorAccessor ?? datum.colorAccessor}
              colorScale={colorScale}
              // {...events}
              component={component}
            />
          </animated.g>
        );
      })}
    </>
  );
}
