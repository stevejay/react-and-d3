import { ReactElement, SVGAttributes, SVGProps, useEffect, useRef } from 'react';
import type { AxisDomain } from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { identity, isNil } from 'lodash-es';

import { center, createAxisDomainPathData, getAxisDomainKey, getDefaultOffset, number } from './axisUtils';
import { SvgGroup } from './SvgGroup';
import type { AxisLabelOrientation, AxisOrientation, DefaultAxisProps, ExpandedAxisScale } from './types';

// TODO see if I can create a more compact version of this function.
function getTickLabelOrientationProps(
  orientation: AxisOrientation,
  labelOrientation: AxisLabelOrientation
): SVGAttributes<SVGTextElement> {
  switch (orientation) {
    case 'top':
      switch (labelOrientation) {
        case 'horizontal':
          return {
            dy: '0em'
          };
        case 'angled':
          return {
            transform: 'rotate(-45)',
            textAnchor: 'start',
            dy: '0.32em',
            dx: '0.32em'
          };
        case 'vertical':
          return {
            transform: 'rotate(-90)',
            textAnchor: 'start',
            dy: '0.32em'
          };
        default:
          throw new Error(`invalid labelOrientation '${labelOrientation}'`);
      }

    case 'bottom':
      switch (labelOrientation) {
        case 'horizontal':
          return {
            dy: '0.71em'
          };
        case 'angled':
          return {
            transform: 'rotate(-45)',
            textAnchor: 'end',
            dy: '0.32em',
            dx: '-0.32em'
          };
        case 'vertical':
          return {
            transform: 'rotate(-90)',
            textAnchor: 'end',
            dy: '0.32em'
          };
        default:
          throw new Error(`invalid labelOrientation '${labelOrientation}'`);
      }

    case 'left':
      switch (labelOrientation) {
        case 'horizontal':
          return {
            dy: '0.32em'
          };
        case 'angled':
          return {
            transform: 'rotate(-45)',
            textAnchor: 'end',
            dx: '-0.32em',
            dy: '0.32em'
          };
        case 'vertical':
          return {
            transform: 'rotate(-90)',
            textAnchor: 'middle'
          };
        default:
          throw new Error(`invalid labelOrientation '${labelOrientation}'`);
      }

    case 'right':
      switch (labelOrientation) {
        case 'horizontal':
          return {
            dy: '0.32em'
          };
        case 'angled':
          return {
            transform: 'rotate(-45)',
            textAnchor: 'start',
            dx: '0.32em',
            dy: '0.32em'
          };
        case 'vertical':
          return {
            transform: 'rotate(90)',
            textAnchor: 'middle'
          };
        default:
          throw new Error(`invalid labelOrientation '${labelOrientation}'`);
      }
  }
}

export type SvgAxisProps<Domain extends AxisDomain> = DefaultAxisProps<Domain> & {
  className?: string;
  domainClassName?: string;
  domainProps?: Omit<
    SVGProps<SVGPathElement>,
    'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
  >;
  tickGroupClassName?: string;
  tickGroupProps?: Omit<
    SVGProps<SVGGElement>,
    'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
  >;
  tickLineClassName?: string;
  tickLineProps?: Omit<
    SVGProps<SVGLineElement>,
    'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
  >;
  tickTextClassName?: string;
  tickTextProps?: Omit<
    SVGProps<SVGTextElement>,
    'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
  >;
  labelOrientation?: AxisLabelOrientation;
};

export function SvgAxis<Domain extends AxisDomain>(
  props: SvgAxisProps<Domain>
): ReactElement<any, any> | null {
  const {
    orientation,
    translateX,
    translateY,
    domainProps,
    tickGroupProps,
    tickLineProps,
    tickTextProps,
    className = '',
    domainClassName = '',
    tickGroupClassName = '',
    tickLineClassName = '',
    tickTextClassName = '',
    labelOrientation = 'horizontal',
    tickArguments = []
  } = props;

  const scale = props.scale as ExpandedAxisScale<Domain>;

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

  const labelOrientationProps = getTickLabelOrientationProps(orientation, labelOrientation);
  const labelGroupTransform = `${translate === 'translateX' ? 'translateY' : 'translateX'}(${k * spacing}px)`;

  return (
    <SvgGroup
      translateX={translateX}
      translateY={translateY}
      textAnchor={orientation === 'right' ? 'start' : orientation === 'left' ? 'end' : 'middle'}
      fill="currentColor"
      stroke="currentColor"
      className={className}
    >
      <motion.path
        fill="none"
        stroke="currentColor"
        animate={{
          d: createAxisDomainPathData(orientation, tickSizeOuter, offset, range0, range1, k)
        }}
        className={domainClassName}
        {...domainProps}
      />
      {/* Send the current position to the tick exit animation variant. */}
      <AnimatePresence custom={position} initial={false}>
        {tickValues.map((tickValue, index) => (
          <motion.g
            key={getAxisDomainKey(tickValue)}
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
              exit: (custom: (d: Domain) => number) => {
                const exitPosition = custom(tickValue);
                return isFinite(exitPosition)
                  ? { opacity: 0, [translate]: exitPosition + offset }
                  : { opacity: 0 };
              }
            }}
            className={tickGroupClassName}
            {...tickGroupProps}
          >
            <line
              {...{ [x + '2']: k * tickSizeInner }}
              stroke="currentColor"
              className={tickLineClassName}
              {...tickLineProps}
            />
            <g style={{ transform: labelGroupTransform }}>
              <text
                stroke="none"
                fill="currentColor"
                role="presentation"
                aria-hidden
                className={tickTextClassName}
                {...labelOrientationProps}
                {...tickTextProps}
              >
                {tickFormat(tickValue, index)}
              </text>
            </g>
          </motion.g>
        ))}
      </AnimatePresence>
    </SvgGroup>
  );
}
