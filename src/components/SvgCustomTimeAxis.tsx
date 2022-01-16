import { useEffect, useMemo, useRef } from 'react';
import { animated, useTransition } from '@react-spring/web';
import { easeCubicInOut } from 'd3-ease';
import { utcMonth } from 'd3-time';
import { identity, isNil, uniq } from 'lodash-es';

import type { AxisScale, ChartArea, ExpandedAxisScale } from '@/types';
import { getAxisDomainAsReactKey, number } from '@/utils/axisUtils';
import { getDefaultRenderingOffset } from '@/utils/renderUtils';

import { SvgAxisDomainPath } from './SvgAxisDomainPath';
import { SvgGroup } from './SvgGroup';

function conditionalClamp(coord: number, shouldClamp: boolean): number {
  return shouldClamp ? Math.max(coord, 0) : coord;
}

export type SvgCustomTimeAxisProps = {
  scale: AxisScale<Date>;
  chartArea: ChartArea;
  transitionSeconds: number;
  animate?: boolean;
};

export function SvgCustomTimeAxis(props: SvgCustomTimeAxisProps) {
  const { chartArea, transitionSeconds, animate = true } = props;
  const scale = props.scale as ExpandedAxisScale<Date>;

  // The length of the inner ticks (which are the ticks with labels).
  const tickSize = 40;
  const yearTickSize = tickSize;

  // The length of the outer ticks.
  const tickSizeOuter = 0;

  // Used to ensure crisp edges on low-resolution devices.
  const renderingOffset = getDefaultRenderingOffset();

  // Determine the exact tick values to use.
  const tickValues = scale.ticks ? scale.ticks(utcMonth.every(1)) : scale.domain();

  const years = uniq(tickValues.map((value) => value.getUTCFullYear()));
  years.sort();
  const yearTickValues = years.map((year) => new Date(Date.UTC(year, 0)));

  // Determine the exact tick text formatter function to use.
  const tickFormat = scale.tickFormat ? scale.tickFormat(-1, '%b') : identity;

  // The scale's range:
  const range = scale.range();

  // The pixel position to start drawing the axis domain line at:
  const range0 = +range[0] + renderingOffset;

  // The pixel position to finish drawing the axis domain line at:
  const range1 = +range[range.length - 1] + renderingOffset;

  // Get a function that can be used to calculate the pixel position for a tick value.
  const position = number(scale.copy());

  // Rough width of a month.
  const monthWidth = (range1 - range0) / tickValues.length;

  // Store the position function so it can be used to animate the entering ticks
  // from the position they would have been in if they were already in the DOM.
  const previousPositionRef = useRef<((d: Date) => number) | null>(null);

  // Always run.
  useEffect(() => {
    previousPositionRef.current = position;
  });

  const reactSpringConfig = useMemo(
    () => ({ duration: transitionSeconds * 1000, easing: easeCubicInOut }),
    [transitionSeconds]
  );

  const monthTickTransitions = useTransition<
    Date,
    { opacity: number; monthWidth: number; translateX: number }
  >(tickValues, {
    initial: (tickValue) => {
      return { opacity: 1, translateX: position(tickValue) + renderingOffset, monthWidth };
    },
    from: (tickValue) => {
      const initialPosition = previousPositionRef.current ? previousPositionRef.current(tickValue) : null;
      return !isNil(initialPosition) && isFinite(initialPosition)
        ? { opacity: 0, translateX: initialPosition + renderingOffset, monthWidth }
        : { opacity: 0, translateX: position(tickValue) + renderingOffset, monthWidth };
    },
    enter: (tickValue) => ({
      opacity: 1,
      translateX: position(tickValue) + renderingOffset,
      monthWidth
    }),
    update: (tickValue) => ({
      opacity: 1,
      translateX: position(tickValue) + renderingOffset,
      monthWidth
    }),
    leave: (tickValue) => {
      const exitPosition = position(tickValue);
      return isFinite(exitPosition)
        ? { opacity: 0, translateX: exitPosition + renderingOffset, monthWidth }
        : { opacity: 0, monthWidth };
    },
    config: reactSpringConfig,
    keys: getAxisDomainAsReactKey,
    immediate: !animate
  });

  const yearTickTransitions = useTransition<Date, { opacity: number; translateX: number }>(yearTickValues, {
    initial: (tickValue, index) => {
      return { opacity: 1, translateX: conditionalClamp(position(tickValue), index === 0) + renderingOffset };
    },
    from: (tickValue, index) => {
      const initialPosition = previousPositionRef.current ? previousPositionRef.current(tickValue) : null;
      return !isNil(initialPosition) && isFinite(initialPosition)
        ? {
            opacity: 0,
            translateX: conditionalClamp(initialPosition, index === 0) + renderingOffset
          }
        : {
            opacity: 0,
            translateX: conditionalClamp(position(tickValue), index === 0) + renderingOffset
          };
    },
    enter: (tickValue, index) => ({
      opacity: 1,
      translateX: conditionalClamp(position(tickValue), index === 0) + renderingOffset
    }),
    update: (tickValue, index) => ({
      opacity: 1,
      translateX: conditionalClamp(position(tickValue), index === 0) + renderingOffset
    }),
    leave: (tickValue) => {
      const exitPosition = position(tickValue);
      return isFinite(exitPosition)
        ? { opacity: 0, translateX: exitPosition + renderingOffset }
        : { opacity: 0 };
    },
    config: reactSpringConfig,
    keys: getAxisDomainAsReactKey,
    immediate: !animate
  });

  return (
    <SvgGroup
      translateX={chartArea.translateLeft}
      translateY={chartArea.translateBottom}
      className="text-[10px]"
      textAnchor="middle"
      fill="currentColor"
      stroke="currentColor"
    >
      <g>
        {monthTickTransitions(({ monthWidth, ...rest }, tickValue, _, index) => (
          <animated.g key={getAxisDomainAsReactKey(tickValue)} data-test-id="month-tick-group" style={rest}>
            <line
              stroke="currentColor"
              className={index === 0 || tickValue.getUTCMonth() === 0 ? '' : 'text-slate-500'}
              strokeDasharray={index === 0 || tickValue.getUTCMonth() === 0 ? 'none' : '5 4'}
              y2={tickSize}
              //   shapeRendering="crispEdges"
              role="presentation"
            />
            <animated.g style={{ transform: monthWidth.to((value) => `translateX(${value * 0.5}px)`) }}>
              <text
                stroke="none"
                dy="0.71em"
                y={tickSize - 26}
                textAnchor="middle"
                className="text-xs"
                role="presentation"
                aria-hidden
              >
                {tickFormat(tickValue)}
              </text>
            </animated.g>
          </animated.g>
        ))}
      </g>
      <g>
        {yearTickTransitions((styles, tickValue, _, index) => {
          const tickYear = tickValue.getUTCFullYear();
          return (
            <animated.g key={tickYear} data-test-id="year-tick-group" style={styles}>
              <text
                fill="currentColor"
                stroke="none"
                y={yearTickSize - 1}
                x={3}
                textAnchor="start"
                className="text-[10px]"
                role="presentation"
                aria-hidden
              >
                {tickYear}
              </text>
            </animated.g>
          );
        })}
      </g>
      <SvgAxisDomainPath
        orientation="bottom"
        tickSize={tickSizeOuter}
        renderingOffset={renderingOffset}
        range={range}
        k={1}
        reactSpringConfig={reactSpringConfig}
        animate
      />
    </SvgGroup>
  );
}
