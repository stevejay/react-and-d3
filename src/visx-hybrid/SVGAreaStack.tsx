import { ReactNode, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { areaStackEventSource, xyChartEventSource } from './constants';
import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { isDefined } from './isDefined';
import { STACK_OFFSETS } from './stackOffset';
import { STACK_ORDERS } from './stackOrder';
import { SVGAreaSeriesProps } from './SVGAreaSeries';
import type { AxisScale } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useSeriesTransitions } from './useSeriesTransitions';
import { useXYChartContext } from './useXYChartContext';

export interface SVGAreaStackProps {
  /** Sets the stack offset to the pre-defined d3 offset, see https://github.com/d3/d3-shape#stack_offset. */
  stackOffset?: keyof typeof STACK_OFFSETS;
  /** Sets the stack order to the pre-defined d3 function, see https://github.com/d3/d3-shape#stack_order. */
  stackOrder?: keyof typeof STACK_ORDERS;
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  enableEvents?: boolean;
  children?: ReactNode;
}

export function SVGAreaStack<Datum extends object>({
  children,
  enableEvents = true,
  animate = true,
  springConfig
}: SVGAreaStackProps) {
  const {
    theme,
    horizontal,
    scales,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore
  } = useXYChartContext<Datum>();
  const seriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<SVGAreaSeriesProps<Datum>>(children),
    [children]
  );
  const dataKeys = seriesChildren.map((child) => child.props.dataKey).filter(isDefined);
  const ownEventSourceKey = `${areaStackEventSource}-${dataKeys.join('-')}`;
  /* const eventEmitters = */ useSeriesEvents<AxisScale, AxisScale, Datum>({
    dataKeyOrKeysRef: dataKeys,
    enableEvents,
    // findNearestOriginalDatum,
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
      {transitions((styles, dataEntry) => {
        const child = seriesChildren.find((child) => child.props.dataKey === dataEntry.dataKey);
        const { groupProps, renderArea } = child?.props ?? {};
        const { style, ...restGroupProps } = groupProps ?? {};
        const fallbackFill = scales.color?.(dataEntry.dataKey) ?? theme?.colors?.[0] ?? 'currentColor';
        return (
          <animated.g
            data-testid={`area-stack-series-${dataEntry.dataKey}`}
            style={{ ...style, ...styles }}
            {...restGroupProps}
          >
            {renderArea &&
              renderArea({
                dataEntry,
                scales,
                theme,
                horizontal,
                renderingOffset,
                animate: animate && contextAnimate,
                springConfig: springConfig ?? contextSpringConfig,
                color: fallbackFill
              })}
          </animated.g>
        );
      })}
    </>
  );
}
