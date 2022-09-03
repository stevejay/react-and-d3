import { ReactNode, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { areaStackEventSource, xyChartEventSource } from './constants';
import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { isDefined } from './isDefined';
import { STACK_OFFSETS } from './stackOffset';
import { STACK_ORDERS } from './stackOrder';
import { SVGAreaSeriesProps } from './SVGAreaSeries';
import { BasicSeriesProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useSeriesTransitions } from './useSeriesTransitions';
import { useXYChartContext } from './useXYChartContext';

export type SVGAreaStackProps<Datum extends object> = {
  /** Sets the stack offset to the pre-defined d3 offset, see https://github.com/d3/d3-shape#stack_offset. */
  stackOffset?: keyof typeof STACK_OFFSETS;
  /** Sets the stack order to the pre-defined d3 function, see https://github.com/d3/d3-shape#stack_order. */
  stackOrder?: keyof typeof STACK_ORDERS;
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  enableEvents?: boolean;
  children?: ReactNode;
} & Pick<
  BasicSeriesProps<Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerDown' | 'onPointerUp' | 'onBlur' | 'onFocus'
>;

export function SVGAreaStack<Datum extends object>({
  children,
  enableEvents = true,
  animate = true,
  springConfig,
  onBlur,
  onFocus,
  onPointerMove,
  onPointerDown,
  onPointerOut,
  onPointerUp
}: SVGAreaStackProps<Datum>) {
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
  const resolvedAnimate = animate && contextAnimate;
  const resolvedSpringConfig = springConfig ?? contextSpringConfig;
  return (
    <>
      {transitions((styles, dataEntry) => {
        const child = seriesChildren.find((child) => child.props.dataKey === dataEntry.dataKey);
        const { groupProps, renderArea, renderPath } = child?.props ?? {};
        const { style, ...restGroupProps } = groupProps ?? {};
        const fallbackFill = scales.color?.(dataEntry.dataKey) ?? theme?.colors?.[0] ?? 'currentColor';
        const fallbackStroke = scales.color?.(dataEntry.dataKey) ?? theme?.colors?.[0] ?? 'currentColor';
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
                animate: resolvedAnimate,
                springConfig: resolvedSpringConfig,
                color: fallbackFill,
                ...eventEmitters
              })}
            {renderPath &&
              renderPath({
                dataEntry,
                scales,
                theme,
                horizontal,
                renderingOffset,
                animate: resolvedAnimate,
                springConfig: resolvedSpringConfig,
                color: fallbackStroke
              })}
          </animated.g>
        );
      })}
    </>
  );
}
