/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { identity, isNil } from 'lodash-es';

import { SvgGroup } from './SvgGroup';

// Returns a function that transforms a domain value into a position in pixels
// using the given scale object to do so. This is the transform used when the
// scale is not a band scale.
function number(scale: d3.AxisScale<d3.NumberValue>) {
  return (d: d3.NumberValue) => +(scale(d) ?? ''); // TODO Not sure what '' should actually be
}

// Returns a function that transforms a domain value into a position in pixels
// using the given scale object to do so. This is the transform used when the
// scale is a band scale.
function center(scale: d3.AxisScale<d3.NumberValue> & { round?: () => boolean }, offset: number) {
  offset = Math.max(0, scale.bandwidth ? scale.bandwidth() - offset * 2 : 0) / 2;
  if (scale.round && scale.round()) {
    offset = Math.round(offset);
  }
  return (d: d3.NumberValue) => +(scale(d) ?? 0) + offset;
}

// A single path is used to draw the domain line and the outer ticks as one
// continuous line.
function createDomainPathData(
  orientation: Orientation,
  tickSizeOuter: number,
  offset: number,
  range0: number,
  range1: number,
  k: number
): string {
  return orientation === 'left' || orientation === 'right'
    ? tickSizeOuter
      ? `M${k * tickSizeOuter},${range0}H${offset}V${range1}H${k * tickSizeOuter}`
      : `M${offset},${range0}V${range1}`
    : tickSizeOuter
    ? `M${range0},${k * tickSizeOuter}V${offset}H${range1}V${k * tickSizeOuter}`
    : `M${range0},${offset}H${range1}`;
}

type Orientation = 'top' | 'bottom' | 'left' | 'right';

// TODO: The generic <Domain> is the type of the axis domain.
// Domain === d3.NumberValue

type AxisProps = {
  scale: d3.AxisScale<d3.NumberValue>;
  translateX: number;
  translateY: number;
  orientation: Orientation;
  offset?: number | null;
  tickPadding?: number | null;
  tickSizeInner?: number | null;
  tickSizeOuter?: number | null;
  tickSize?: number | null;
  tickFormat?: (domainValue: d3.NumberValue, index: number) => string | null;
  tickValues?: d3.NumberValue[] | null;
  // issue of ticks and tickArguments
  ticksCount?: number | null;
  ticksSpecifier?: string | null;
};

export const Axis: FC<AxisProps> = (props) => {
  const { orientation, translateX, translateY } = props;
  const scale = props.scale as d3.AxisScale<d3.NumberValue> & {
    ticks?(count?: number): d3.NumberValue[];
    tickFormat?(count?: number, specifier?: string): (d: d3.NumberValue) => string;
  };

  // The length of the inner ticks (which are the ticks with labels).
  const tickSizeInner = props.tickSize ?? props.tickSizeInner ?? 6;

  // The length of the outer ticks.
  const tickSizeOuter = props.tickSize ?? props.tickSizeOuter ?? 6;

  // The distance in pixels between the end of the tick's line and the tick's
  // label.
  const tickPadding = props.tickPadding ?? 3;

  // Used to ensure crisp edges on low-resolution devices.
  const offset = props.offset ?? (typeof window !== 'undefined' && window.devicePixelRatio > 1 ? 0 : 0.5);

  // Three constants to allow the axis function to support all of the four
  // orientations.
  const k = orientation === 'top' || orientation === 'left' ? -1 : 1;
  const x = orientation === 'left' || orientation === 'right' ? 'x' : 'y';
  const translate = orientation === 'top' || orientation === 'bottom' ? 'translateX' : 'translateY';

  // Determine the exact tick values to use.
  const tickValues = isNil(props.tickValues)
    ? scale.ticks
      ? scale.ticks() // Major issue here to do with tickArguments and the alternative ticks() forms.
      : scale.domain()
    : props.tickValues;

  // Determine the exact tick text formatter function to use.
  const tickFormat =
    props.tickFormat == null
      ? scale.tickFormat
        ? scale.tickFormat() // Major issue here to do with tickArguments and the alternative tickFormat() forms.
        : identity
      : props.tickFormat;

  // The distance between the axis domain line and the tick labels.
  const spacing = Math.max(tickSizeInner, 0) + tickPadding;

  // The scale's range:
  const range = scale.range();

  // The pixel position to start drawing the axis domain line at:
  const range0 = +range[0] + offset;

  // The pixel position to finish drawing the axis domain line at:
  const range1 = +range[range.length - 1] + offset;

  // Get a function that can be used to calculate the pixel position for a tick
  // value. This has special handling if the scale is a band scale, in which case
  // the position is in the center of each band. The scale needs to be copied
  // (`scale.copy()`)because it will later be stored in the DOM to be used for
  // enter animations the next time that this axis component is rendered.
  const position = (scale.bandwidth ? center : number)(scale.copy(), offset);

  // Store the position function so it can be used to animate the entering ticks
  // from the position they would have been in if they were already in the DOM.
  const previousPositionRef = useRef<((d: d3.NumberValue) => number) | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  }, [position]); // Always run

  return (
    <SvgGroup
      translateX={translateX}
      translateY={translateY}
      className="text-[10px]"
      textAnchor={orientation === 'right' ? 'start' : orientation === 'left' ? 'end' : 'middle'}
      fill="none"
    >
      <motion.path
        stroke="currentColor"
        animate={{
          d: createDomainPathData(orientation, tickSizeOuter, offset, range0, range1, k)
        }}
      />
      {/* Send the current position to the tick exit animation variant */}
      <AnimatePresence custom={position}>
        {tickValues.map((tickValue, index) => {
          // May be an issue here with the sorting of the tick values.
          // Also not sure about the `index` on the tickFormat call.

          //   const exitPosition = position(tickValue);
          //   const exit = isFinite(exitPosition)
          //     ? { opacity: 0, [translate]: exitPosition + offset }
          //     : { opacity: 0 };

          //   const initialPosition = previousPositionRef.current ? previousPositionRef.current(tickValue) : null;
          //   const initial =
          //     !isNil(initialPosition) && isFinite(initialPosition)
          //       ? { opacity: 0, [translate]: initialPosition + offset }
          //       : { opacity: 0, [translate]: position(tickValue) + offset };

          return (
            <motion.g
              //   key={scale(tickValue)}
              key={tickValue.toString()}
              stroke="currentColor"
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
                exit: (custom: (d: d3.NumberValue) => number) => {
                  const exitPosition = custom(tickValue);
                  return isFinite(exitPosition)
                    ? { opacity: 0, [translate]: exitPosition + offset }
                    : { opacity: 0 };
                }
              }}

              //   initial={initial}
              //   animate={{ opacity: 1, [translate]: position(tickValue) + offset }}
              //   exit={exit}
            >
              <motion.line
                stroke="currentColor"
                initial={false}
                animate={{ [x + '2']: k * tickSizeInner }}
                exit={{ [x + '2']: k * tickSizeInner }}
              />
              <motion.text
                fill="currentColor"
                stroke="none"
                dy={orientation === 'top' ? '0em' : orientation === 'bottom' ? '0.71em' : '0.32em'}
                initial={false}
                animate={{ [x]: k * spacing }}
                exit={{ [x]: k * spacing }}
              >
                {tickFormat(tickValue, index)}
              </motion.text>
            </motion.g>
          );
        })}
      </AnimatePresence>
    </SvgGroup>
  );
};
