import { ReactElement, useEffect, useRef } from 'react';
import { useForceUpdate } from '@uifabric/react-hooks';
import { AnimatePresence, m as motion } from 'framer-motion';
import { differenceBy, identity, isNil, sortBy, unionBy } from 'lodash-es';
import useDebouncedEffect from 'use-debounced-effect';

import type { BaseAxisProps, DomainValue, ExpandedAxisScale, TickLabelOrientation } from '@/types';
import { center, createAxisDomainPathData, getAxisDomainAsReactKey, number } from '@/utils/axisUtils';
import { getDefaultRenderingOffset } from '@/utils/renderUtils';

import { SvgGroup } from './SvgGroup';

function getExitingTickValues<DomainT extends DomainValue>(
  tickValues: DomainT[],
  previousTickValues: DomainT[],
  exitingTickValues: DomainT[]
) {
  const iteratee = (x: DomainT) => (x.valueOf ? x.valueOf() : x);
  return differenceBy(unionBy(previousTickValues, exitingTickValues, iteratee), tickValues, iteratee);
}

export type SvgAxisNoExitProps<DomainT extends DomainValue> = BaseAxisProps<DomainT> & {
  transitionSeconds?: number;
  tickLabelOrientation?: TickLabelOrientation;
};

export function SvgAxisNoExit<DomainT extends DomainValue>(
  props: SvgAxisNoExitProps<DomainT>
): ReactElement<any, any> | null {
  const { orientation, chartArea, transitionSeconds = 0.25, tickArguments = [] } = props;
  const scale = props.scale as ExpandedAxisScale<DomainT>;

  const forceUpdate = useForceUpdate();

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
  const range0 = +range[0] + renderingOffset;

  // The pixel position to finish drawing the axis domain line at.
  const range1 = +range[range.length - 1] + renderingOffset;

  // Get a function that can be used to calculate the pixel position for a tick
  // value. This has special handling if the scale is a band scale, in which case
  // the position is in the center of each band. The scale needs to be copied
  // (`scale.copy()`)because it will later be stored in the DOM to be used for
  // enter animations the next time that this axis component is rendered.
  const position = (scale.bandwidth ? center : number)(scale.copy(), renderingOffset);

  // Store the position function so it can be used to animate the entering ticks
  // from the position they would have been in if they were already in the DOM.
  const previousPositionRef = useRef<typeof position | null>(null);

  const exitingTickValuesRef = useRef<DomainT[]>([]);
  const previousTickValuesRef = useRef<DomainT[]>([]);

  // Updated exiting is current exiting plus any new exiting minus any resurrected ones.
  const exiting = getExitingTickValues(
    tickValues,
    previousTickValuesRef.current,
    exitingTickValuesRef.current
  );

  const currentAndExiting = sortBy(
    [
      ...tickValues.map((tickValue) => ({ exiting: false, tickValue })),
      ...exiting.map((tickValue) => ({ exiting: true, tickValue }))
    ],
    (x) => x.tickValue
  );

  // Always run.
  useEffect(() => {
    previousPositionRef.current = position;
    previousTickValuesRef.current = tickValues;
    exitingTickValuesRef.current = exiting;
  });

  useDebouncedEffect(() => {
    if (exitingTickValuesRef.current.length) {
      exitingTickValuesRef.current = [];
      forceUpdate();
    }
  }, transitionSeconds * 1000);

  const translateX = orientation === 'right' ? chartArea.translateRight : chartArea.translateLeft;
  const translateY = orientation === 'bottom' ? chartArea.translateBottom : chartArea.translateTop;

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
          d: createAxisDomainPathData(orientation, tickSizeOuter, renderingOffset, range0, range1, k)
        }}
        role="presentation"
      />
      <AnimatePresence initial={false}>
        {currentAndExiting.map(({ tickValue, exiting }, index) => (
          <motion.g
            key={getAxisDomainAsReactKey(tickValue)}
            initial="initial"
            animate={exiting ? 'exit' : 'animate'}
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
              exit: () => {
                const exitPosition = position(tickValue);
                return isFinite(exitPosition)
                  ? { opacity: 0, [translate]: exitPosition + renderingOffset }
                  : { opacity: 0 };
              }
            }}
          >
            <motion.line initial={false} animate={{ [x + '2']: k * tickSizeInner }} role="presentation" />
            <motion.text
              stroke="none"
              dy={orientation === 'top' ? '0em' : orientation === 'bottom' ? '0.71em' : '0.32em'}
              initial={false}
              animate={{ [x === 'x' ? 'attrX' : 'attrY']: k * spacing }}
              role="presentation"
              aria-hidden
            >
              {tickFormat(tickValue)}
            </motion.text>
          </motion.g>
        ))}
      </AnimatePresence>
    </SvgGroup>
  );
}
