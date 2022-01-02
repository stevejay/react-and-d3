import { useEffect, useRef } from 'react';
import type { AxisScale } from 'd3';
import { utcMonth } from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { identity, isNil, uniq } from 'lodash-es';

import type { ExpandedAxisScale } from '@/types';
import { createAxisDomainPathData, getAxisDomainAsReactKey, number } from '@/utils/axisUtils';
import { getDefaultOffset } from '@/utils/renderUtils';

import { SvgGroup } from './SvgGroup';

function conditionalClamp(coord: number, shouldClamp: boolean): number {
  return shouldClamp ? Math.max(coord, 0) : coord;
}

export type SvgCustomTimeAxisProps = {
  scale: AxisScale<Date>;
  translateX: number;
  translateY: number;
};

export function SvgCustomTimeAxis(props: SvgCustomTimeAxisProps) {
  const { translateX, translateY } = props;
  const scale = props.scale as ExpandedAxisScale<Date>;

  // The length of the inner ticks (which are the ticks with labels).
  const tickSize = 40;
  const yearTickSize = tickSize;

  // The length of the outer ticks.
  const tickSizeOuter = 0;

  // Used to ensure crisp edges on low-resolution devices.
  const offset = getDefaultOffset();

  // Three constants to allow the axis function to support all of the four orientations.
  const k = 1;
  const x = 'y';
  const translate = 'translateX';

  // Determine the exact tick values to use.
  const tickValues = scale.ticks ? scale.ticks(utcMonth.every(1)) : scale.domain();

  const years = uniq(tickValues.map((x) => x.getUTCFullYear()));
  years.sort();
  const yearTickValues = years.map((year) => new Date(Date.UTC(year, 0)));

  // Determine the exact tick text formatter function to use.
  const tickFormat = scale.tickFormat ? scale.tickFormat(-1, '%b') : identity;

  // The scale's range:
  const range = scale.range();

  // The pixel position to start drawing the axis domain line at:
  const range0 = +range[0] + offset;

  // The pixel position to finish drawing the axis domain line at:
  const range1 = +range[range.length - 1] + offset;

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

  return (
    <SvgGroup
      translateX={translateX}
      translateY={translateY}
      className="text-[10px]"
      textAnchor="middle"
      fill="currentColor"
      stroke="currentColor"
    >
      <g>
        <AnimatePresence custom={position} initial={false}>
          {tickValues.map((tickValue, index) => (
            <motion.g
              key={getAxisDomainAsReactKey(tickValue)}
              custom={position}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: () => {
                  const initialPosition = previousPositionRef.current
                    ? previousPositionRef.current(tickValue)
                    : null;
                  return !isNil(initialPosition) && isFinite(initialPosition)
                    ? { opacity: 0, [translate]: initialPosition + offset }
                    : { opacity: 0, [translate]: position(tickValue) + offset };
                },
                animate: () => ({ opacity: 1, [translate]: position(tickValue) + offset }),
                exit: (custom: (d: Date) => number) => {
                  const exitPosition = custom(tickValue);
                  return isFinite(exitPosition)
                    ? { opacity: 0, [translate]: exitPosition + offset }
                    : { opacity: 0 };
                }
              }}
            >
              <line
                stroke="currentColor"
                className={index === 0 || tickValue.getUTCMonth() === 0 ? '' : 'text-slate-500'}
                strokeDasharray={index === 0 || tickValue.getUTCMonth() === 0 ? 'none' : '5 4'}
                {...{ [x + '2']: k * tickSize }}
                shapeRendering="crispEdges"
                role="presentation"
              />
              <motion.g
                initial={false}
                animate="animate"
                variants={{
                  animate: { x: monthWidth * 0.5 }
                }}
              >
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
              </motion.g>
            </motion.g>
          ))}
        </AnimatePresence>
      </g>
      <g>
        <AnimatePresence custom={position} initial={false}>
          {yearTickValues.map((tickValue, index) => {
            const tickYear = tickValue.getUTCFullYear();
            const isFirstTick = index === 0;
            return (
              <motion.g
                key={tickYear}
                custom={position}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: () => {
                    const initialPosition = previousPositionRef.current
                      ? previousPositionRef.current(tickValue)
                      : null;
                    return !isNil(initialPosition) && isFinite(initialPosition)
                      ? { opacity: 0, [translate]: conditionalClamp(initialPosition, isFirstTick) + offset }
                      : {
                          opacity: 0,
                          [translate]: conditionalClamp(position(tickValue), isFirstTick) + offset
                        };
                  },
                  animate: () => ({
                    opacity: 1,
                    [translate]: conditionalClamp(position(tickValue), isFirstTick) + offset
                  }),
                  exit: (custom: (d: Date) => number) => {
                    const exitPosition = custom(tickValue);
                    return isFinite(exitPosition)
                      ? { opacity: 0, [translate]: exitPosition + offset }
                      : { opacity: 0 };
                  }
                }}
              >
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
              </motion.g>
            );
          })}
        </AnimatePresence>
      </g>
      <motion.path
        fill="none"
        animate={{
          d: createAxisDomainPathData('bottom', tickSizeOuter, offset, range0, range1, k)
        }}
        shapeRendering="crispEdges"
        role="presentation"
      />
    </SvgGroup>
  );
}
