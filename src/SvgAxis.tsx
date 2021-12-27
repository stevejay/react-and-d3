import { FC, useEffect, useRef } from 'react';
import type { AxisDomain } from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { identity, isNil } from 'lodash-es';

import { center, createAxisDomainPathData, getDefaultOffset, getTickKey, number } from './axisUtils';
import { SvgGroup } from './SvgGroup';
import type { DefaultAxisProps, ExpandedAxisScale } from './types';

export type SvgAxisProps = DefaultAxisProps;

export const SvgAxis: FC<SvgAxisProps> = (props) => {
  const { orientation, translateX, translateY, tickArguments = [] } = props;
  const scale = props.scale as ExpandedAxisScale;

  // The length of the inner ticks (which are the ticks with labels).
  const tickSizeInner = props.tickSize ?? props.tickSizeInner ?? 6;

  // The length of the outer ticks.
  const tickSizeOuter = props.tickSize ?? props.tickSizeOuter ?? 6;

  // The distance in pixels between the end of the tick's line and the tick's label.
  const tickPadding = props.tickPadding ?? 3;

  // Used to ensure crisp edges on low-resolution devices.
  const offset = props.offset ?? getDefaultOffset();

  // Three constants to allow the axis function to support all of the four orientations.
  const k = orientation === 'top' || orientation === 'left' ? -1 : 1;
  const x = orientation === 'left' || orientation === 'right' ? 'x' : 'y';
  const translate = orientation === 'top' || orientation === 'bottom' ? 'translateX' : 'translateY';

  // Determine the exact tick values to use.
  const tickValues = isNil(props.tickValues)
    ? scale.ticks
      ? scale.ticks(...tickArguments)
      : scale.domain()
    : props.tickValues;

  // Determine the exact tick text formatter function to use.
  const tickFormat =
    props.tickFormat == null
      ? scale.tickFormat
        ? scale.tickFormat(...tickArguments)
        : identity
      : props.tickFormat;

  // The distance between the axis domain line and the tick labels.
  const spacing = Math.max(tickSizeInner, 0) + tickPadding;

  // The scale's range.
  const range = scale.range();

  // The pixel position to start drawing the axis domain line at.
  const range0 = +range[0] + offset;

  // The pixel position to finish drawing the axis domain line at.
  const range1 = +range[range.length - 1] + offset;

  // Get a function that can be used to calculate the pixel position for a tick
  // value. This has special handling if the scale is a band scale, in which case
  // the position is in the center of each band. The scale needs to be copied
  // (`scale.copy()`)because it will later be stored in the DOM to be used for
  // enter animations the next time that this axis component is rendered.
  const position = (scale.bandwidth ? center : number)(scale.copy(), offset);

  // Store the position function so it can be used to animate the entering ticks
  // from the position they would have been in if they were already in the DOM.
  const previousPositionRef = useRef<typeof position | null>(null);

  // Always run.
  useEffect(() => {
    previousPositionRef.current = position;
  });

  return (
    <SvgGroup
      translateX={translateX}
      translateY={translateY}
      className="text-[10px]"
      textAnchor={orientation === 'right' ? 'start' : orientation === 'left' ? 'end' : 'middle'}
      fill="currentColor"
      stroke="currentColor"
    >
      <motion.path
        fill="none"
        animate={{
          d: createAxisDomainPathData(orientation, tickSizeOuter, offset, range0, range1, k)
        }}
      />
      {/* Send the current position to the tick exit animation variant. */}
      <AnimatePresence custom={position}>
        {tickValues.map((tickValue, index) => (
          <motion.g
            key={getTickKey(tickValue)}
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
              exit: (custom: (d: AxisDomain) => number) => {
                const exitPosition = custom(tickValue);
                return isFinite(exitPosition)
                  ? { opacity: 0, [translate]: exitPosition + offset }
                  : { opacity: 0 };
              }
            }}
          >
            <motion.line initial={false} animate={{ [x + '2']: k * tickSizeInner }} />
            <motion.text
              stroke="none"
              dy={orientation === 'top' ? '0em' : orientation === 'bottom' ? '0.71em' : '0.32em'}
              initial={false}
              animate={{ [x === 'x' ? 'attrX' : 'attrY']: k * spacing }}
              role="presentation"
              aria-hidden
            >
              {tickFormat(tickValue, index)}
            </motion.text>
          </motion.g>
        ))}
      </AnimatePresence>
    </SvgGroup>
  );
};
