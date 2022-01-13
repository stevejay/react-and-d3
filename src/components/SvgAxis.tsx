import { ReactElement, SVGAttributes, SVGProps, useEffect, useRef } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { identity, isNil } from 'lodash-es';

import type {
  AxisLabelAlign,
  AxisOrientation,
  BaseAxisProps,
  ChartArea,
  DomainValue,
  ExpandedAxisScale,
  TickLabelOrientation
} from '@/types';
import { center, createAxisDomainPathData, getAxisDomainAsReactKey, number } from '@/utils/axisUtils';
import { getDefaultRenderingOffset } from '@/utils/renderUtils';

import { SvgGroup } from './SvgGroup';

function getAxisLabelOrientationProps(
  axisOrientation: AxisOrientation,
  axisLabelAlignment: AxisLabelAlign,
  chartArea: ChartArea,
  axisLabelSpacing: number,
  renderingOffset: number
) {
  switch (axisOrientation) {
    case 'bottom':
      switch (axisLabelAlignment) {
        case 'center':
          return {
            transform: `translate(${chartArea.width * 0.5},${axisLabelSpacing + renderingOffset})`,
            textAnchor: 'middle',
            dy: '0.71em'
          };
        case 'end':
          return {
            transform: `translate(${chartArea.width},${axisLabelSpacing + renderingOffset})`,
            textAnchor: 'end',
            dy: '0.71em'
          };
        case 'start':
          return {
            transform: `translate(${0},${axisLabelSpacing + renderingOffset})`,
            textAnchor: 'start',
            dy: '0.71em'
          };
        default:
          throw new Error('not implemented');
      }
    case 'left':
      switch (axisLabelAlignment) {
        case 'center':
          return {
            transform: `translate(${-axisLabelSpacing + renderingOffset},${
              chartArea.height * 0.5
            }) rotate(-90)`,
            textAnchor: 'middle',
            dy: '0.71em'
          };
        case 'start':
          return {
            transform: `translate(${-axisLabelSpacing + renderingOffset},${chartArea.height}) rotate(-90)`,
            textAnchor: 'start',
            dy: '0.71em'
          };
        case 'end':
          return {
            transform: `translate(${-axisLabelSpacing + renderingOffset},${0}) rotate(-90)`,
            textAnchor: 'end',
            dy: '0.71em'
          };
        default:
          throw new Error('not implemented');
      }
    default:
      throw new Error('not implemented');
  }
}

function getTickLabelOrientationProps(
  axisOrientation: AxisOrientation,
  tickLabelOrientation: TickLabelOrientation
): SVGAttributes<SVGTextElement> {
  switch (axisOrientation) {
    case 'top':
      switch (tickLabelOrientation) {
        case 'horizontal':
          return { dy: '0em' };
        case 'angled':
          return { transform: 'rotate(-45)', textAnchor: 'start', dy: '0.32em', dx: '0.32em' };
        default:
          return { transform: 'rotate(-90)', textAnchor: 'start', dy: '0.32em' };
      }
    case 'bottom':
      switch (tickLabelOrientation) {
        case 'horizontal':
          return { dy: '0.71em' };
        case 'angled':
          return { transform: 'rotate(-45)', textAnchor: 'end', dy: '0.32em', dx: '-0.32em' };
        default:
          return { transform: 'rotate(-90)', textAnchor: 'end', dy: '0.32em' };
      }
    case 'left':
      switch (tickLabelOrientation) {
        case 'horizontal':
          return { dy: '0.32em' };
        case 'angled':
          return { transform: 'rotate(-45)', textAnchor: 'end', dx: '-0.32em', dy: '0.32em' };
        default:
          return { transform: 'rotate(-90)', textAnchor: 'middle' };
      }
    case 'right':
      switch (tickLabelOrientation) {
        case 'horizontal':
          return { dy: '0.32em' };
        case 'angled':
          return { transform: 'rotate(-45)', textAnchor: 'start', dx: '0.32em', dy: '0.32em' };
        default:
          return { transform: 'rotate(90)', textAnchor: 'middle' };
      }
  }
}

const noAnimations = { duration: 0, type: 'tween' };

export type SvgAxisProps<DomainT extends DomainValue> = BaseAxisProps<DomainT> & {
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
  tickLabelOrientation?: TickLabelOrientation;
  /**
   * Pass `true` to entirely remove the axis domain line. This line includes
   * the outer ticks, so in that case `tickSizeOuter` will have no effect and
   * `tickSize` will only affect the inner tick size.
   * Defaults to `false`.
   */
  hideDomainPath?: boolean;
  axisLabel?: string;
  axisLabelAlignment?: AxisLabelAlign;
  axisLabelSpacing?: number;
  axisLabelClassName?: string;
  animate?: boolean;
};

export function SvgAxis<DomainT extends DomainValue>(props: SvgAxisProps<DomainT>): ReactElement | null {
  const {
    orientation,
    chartArea,
    domainProps,
    tickGroupProps,
    tickLineProps,
    tickTextProps,
    className = '',
    domainClassName = '',
    tickGroupClassName = '',
    tickLineClassName = '',
    tickTextClassName = '',
    tickLabelOrientation = 'horizontal',
    tickArguments = [],
    hideDomainPath = false,
    axisLabel,
    axisLabelAlignment = 'center',
    axisLabelSpacing = 30,
    axisLabelClassName = '',
    animate = true
  } = props;

  const scale = props.scale as ExpandedAxisScale<DomainT>;

  // The length of the inner ticks (which are the ticks with labels).
  const tickSizeInner = props.tickSize ?? props.tickSizeInner ?? 6;

  // The length of the outer ticks.
  const tickSizeOuter = props.tickSize ?? props.tickSizeOuter ?? 6;

  // The distance in pixels between the end of the tick's line and the tick's label.
  const tickPadding = props.tickPadding ?? 3;

  // Used to ensure crisp edges on low-resolution devices.
  const renderingOffset = props.offset ?? getDefaultRenderingOffset();

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
  let range0 = +range[0] + renderingOffset;

  // The pixel position to finish drawing the axis domain line at.
  let range1 = +range[range.length - 1] + renderingOffset;

  // Get a function that can be used to calculate the pixel position for a tick
  // value. This has special handling if the scale is a band scale, in which case
  // the position is in the center of each band. The scale needs to be copied
  // (`scale.copy()`)because it will later be stored in the DOM to be used for
  // enter animations the next time that this axis component is rendered.
  const position = (scale.bandwidth ? center : number)(scale.copy(), renderingOffset);

  // Store the position function so it can be used to animate the entering ticks
  // from the position they would have been in if they were already in the DOM.
  const previousPositionRef = useRef<typeof position | null>(null);

  // Always run.
  useEffect(() => {
    previousPositionRef.current = position;
  });

  const tickLabelOrientationProps = getTickLabelOrientationProps(orientation, tickLabelOrientation);
  const labelGroupTransform = `${translate === 'translateX' ? 'translateY' : 'translateX'}(${k * spacing}px)`;

  const translateX = orientation === 'right' ? chartArea.translateRight : chartArea.translateLeft;
  const translateY = orientation === 'bottom' ? chartArea.translateBottom : chartArea.translateTop;

  const axisLabelOrientationProps = getAxisLabelOrientationProps(
    orientation,
    axisLabelAlignment,
    chartArea,
    axisLabelSpacing,
    renderingOffset
  );

  return (
    <SvgGroup
      data-test-id={`axis-${orientation}`}
      translateX={translateX}
      translateY={translateY}
      textAnchor={orientation === 'right' ? 'start' : orientation === 'left' ? 'end' : 'middle'}
      fill="currentColor"
      stroke="currentColor"
      className={className}
    >
      {!hideDomainPath && (
        <motion.path
          data-test-id="domain-path"
          fill="none"
          stroke="currentColor"
          role="presentation"
          transition={animate ? undefined : noAnimations}
          animate={{
            d: createAxisDomainPathData(orientation, tickSizeOuter, renderingOffset, range0, range1, k)
          }}
          className={domainClassName}
          {...domainProps}
        />
      )}
      {/* Send the current position to the tick exit animation variant. */}
      <AnimatePresence custom={position} initial={false}>
        {tickValues.map((tickValue, index) => (
          <motion.g
            key={getAxisDomainAsReactKey(tickValue)}
            data-test-id="tick-group"
            custom={position}
            transition={animate ? undefined : noAnimations}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: () => {
                const initialPosition = previousPositionRef.current
                  ? previousPositionRef.current(tickValue)
                  : null;
                return !isNil(initialPosition) && isFinite(initialPosition)
                  ? { opacity: 0, [translate]: initialPosition + renderingOffset }
                  : { opacity: 0, [translate]: position(tickValue) + renderingOffset };
              },
              animate: () => ({ opacity: 1, [translate]: position(tickValue) + renderingOffset }),
              exit: (custom: (d: DomainT) => number) => {
                const exitPosition = custom(tickValue);
                return isFinite(exitPosition)
                  ? { opacity: 0, [translate]: exitPosition + renderingOffset }
                  : { opacity: 0 };
              }
            }}
            className={tickGroupClassName}
            {...tickGroupProps}
          >
            <line
              data-test-id="tick"
              {...{ [x + '2']: k * tickSizeInner }}
              stroke="currentColor"
              role="presentation"
              className={tickLineClassName}
              {...tickLineProps}
            />
            <g data-test-id="tick-label-group" style={{ transform: labelGroupTransform }}>
              <text
                data-test-id="tick-label"
                stroke="none"
                fill="currentColor"
                role="presentation"
                aria-hidden
                className={tickTextClassName}
                {...tickLabelOrientationProps}
                {...tickTextProps}
              >
                {tickFormat(tickValue, index)}
              </text>
            </g>
          </motion.g>
        ))}
      </AnimatePresence>

      {/* {tickValues.map((tickValue, index) => (
        <g
          key={getAxisDomainAsReactKey(tickValue)}
          data-test-id="tick-group"
          transform={
            translate === 'translateX'
              ? `translate(${position(tickValue) + renderingOffset} 0)`
              : `translate(0 ${position(tickValue) + renderingOffset})`
          }
          className={tickGroupClassName}
          {...tickGroupProps}
        >
          <line
            data-test-id="tick"
            {...{ [x + '2']: k * tickSizeInner }}
            stroke="currentColor"
            role="presentation"
            className={tickLineClassName}
            {...tickLineProps}
          />
          <g data-test-id="tick-label-group" style={{ transform: labelGroupTransform }}>
            <text
              data-test-id="tick-label"
              stroke="none"
              fill="currentColor"
              role="presentation"
              aria-hidden
              className={tickTextClassName}
              {...tickLabelOrientationProps}
              {...tickTextProps}
            >
              {tickFormat(tickValue, index)}
            </text>
          </g>
        </g>
      ))} */}

      {axisLabel && (
        <g data-test-id="axis-label-group" transform={axisLabelOrientationProps.transform}>
          <text
            data-test-id="axis-label"
            stroke="none"
            fill="currentColor"
            className={axisLabelClassName}
            textAnchor={axisLabelOrientationProps.textAnchor}
            dy={axisLabelOrientationProps.dy}
            role="presentation"
            aria-hidden
          >
            {axisLabel}
          </text>
        </g>
      )}
    </SvgGroup>
  );
}
