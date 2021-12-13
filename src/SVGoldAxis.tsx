import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { identity, isNil } from 'lodash-es';

import { SvgGroup } from './SvgGroup';

// Returns a function that transforms a domain value into a position in pixels
// using the given scale object to do so. This is the transform used when the
// scale is not a band scale.
function number<Domain>(scale: d3.AxisScale<Domain>) {
  return (d: Domain) => +(scale(d) ?? ''); // TODO Not sure what '' should actually be
}

// Returns a function that transforms a domain value into a position in pixels
// using the given scale object to do so. This is the transform used when the
// scale is a band scale.
function center<Domain>(scale: d3.AxisScale<Domain> & { round?: () => boolean }, offset: number) {
  offset = Math.max(0, scale.bandwidth ? scale.bandwidth() - offset * 2 : 0) / 2;
  if (scale.round && scale.round()) {
    offset = Math.round(offset);
  }
  return (d: Domain) => +(scale(d) ?? 0) + offset;
}

// A single path is used to draw the domain line and the outer ticks as one
// continuous line.
function createDomainPathString(
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

export type Orientation = 'top' | 'bottom' | 'left' | 'right';

export type SVGAxisAxisProps<Domain> = {
  /**
   * The scale used to render the axis. Required.
   */
  scale: d3.AxisScale<Domain>;
  /**
   * The position of the axis relative to the chart that it annotates. Required.
   */
  orientation: Orientation;
  /*
   * The horizontal distance in pixels to translate the axis by, relative to the
   * SVG's origin.  Required.
   */
  translateX: number;
  /*
   * The vertical distance in pixels to translate the axis by, relative to the
   * SVG's origin.  Required.
   */
  translateY: number;
  /**
   * The offset in pixels. Used to ensure crisp edges on low-resolution devices.
   * Defaults to 0 on devices with a devicePixelRatio greater than 1, and 0.5px otherwise.
   */
  offset?: number | null;
  /**
   * The spacing in pixels between a ticks and its label. Defaults to 3px.
   */
  tickPadding?: number | null;
  /**
   * The length in pixels of the inner tick lines. Defaults to 6px.
   */
  tickSizeInner?: number | null;
  /**
   * The length in pixels of the outer tick lines. Defaults to 6px.
   */
  tickSizeOuter?: number | null;
  /**
   * Sets both `tickSizeInner` and `tickSizeOuter` to the given pixel value.
   */
  tickSize?: number | null;
  /**
   * Sets the arguments that will be passed to scale.ticks and scale.tickFormat
   * when the axis is rendered. If you previously used the `ticks` property on the
   * d3 axis component then use `tickArguments` instead (passing the args as an
   * array).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tickArguments?: any[];
  /**
   * Sets the formatter function. Pass `null` to explicitly use the scale's
   * default formatter. Defaults to the scale's default formatter.
   */
  tickFormat?: (domainValue: Domain, index: number) => string | null;
  /**
   * The ticks values to use for ticks instead of those returned by the scale’s
   * automatic tick generator
   */
  tickValues?: Domain[] | null;
};

export function SVGAxis<Domain>(props: SVGAxisAxisProps<Domain>) {
  const { orientation, translateX, translateY, tickArguments = [] } = props;

  const scale = props.scale as d3.AxisScale<Domain> & {
    ticks?(...args: any[]): Domain[];
    tickFormat?(...args: any[]): (d: Domain) => string;
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
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        scale.ticks(...tickArguments)
      : scale.domain()
    : props.tickValues;

  // Determine the exact tick text formatter function to use.
  const tickFormat =
    props.tickFormat == null
      ? scale.tickFormat
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          scale.tickFormat(...tickArguments)
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
  const previousPositionRef = useRef<((d: Domain) => number) | null>(null);
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
          d: createDomainPathString(orientation, tickSizeOuter, offset, range0, range1, k)
        }}
      />
      {/* Send the current position to the tick exit animation variant */}
      <AnimatePresence custom={position}>
        {
          // orderBy(tickValues, (d) => (d as unknown as object | number | string).toString())

          tickValues.map((tickValue, index) => {
            // May be an issue here with the sorting of the tick values.
            // Also not sure about the `index` on the tickFormat call.

            //   console.log(tickValue, scale(tickValue));

            return (
              <motion.g
                //   key={scale(tickValue)}
                key={(tickValue as unknown as object | number | string).toString()}
                stroke="currentColor"
                // The custom prop value is actually never used. It only exists here to make
                // framer motion pass the custom value on the parent AnimatePresence component
                // to the exit variant function.
                custom={position}
                initial="initial"
                animate="animate"
                exit="exit"
                //   variants={{
                //     initial: (custom: (d: Domain) => number) => {
                //       const initialPosition = previousPositionRef.current
                //         ? previousPositionRef.current(tickValue)
                //         : null;
                //       return !isNil(initialPosition) && isFinite(initialPosition)
                //         ? { opacity: 0, [translate]: initialPosition + offset }
                //         : { opacity: 0, [translate]: custom(tickValue) + offset };
                //     },
                //     animate: (custom: (d: Domain) => number) => ({
                //       opacity: 1,
                //       [translate]: custom(tickValue) + offset
                //     }),
                //     exit: (custom: (d: Domain) => number) => {
                //       const exitPosition = custom(tickValue);
                //       return isFinite(exitPosition)
                //         ? { opacity: 0, [translate]: exitPosition + offset }
                //         : { opacity: 0 };
                //     }
                //   }}
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
                  exit: (custom: (d: Domain) => number) => {
                    const exitPosition = custom(tickValue);
                    return isFinite(exitPosition)
                      ? { opacity: 0, [translate]: exitPosition + offset }
                      : { opacity: 0 };
                  }
                }}
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
          })
        }
      </AnimatePresence>
    </SvgGroup>
  );
}
