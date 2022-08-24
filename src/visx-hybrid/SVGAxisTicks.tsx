import type { SVGProps } from 'react';
import { animated, SpringConfig } from 'react-spring';

import {
  defaultHideTicks,
  defaultTickLabelAngle,
  defaultTickLabelPadding,
  defaultTickLength
} from './constants';
import { SVGAxisTickLabel } from './SVGAxisTickLabel';
import { SVGAxisTickLine } from './SVGAxisTickLine';
import { TextProps } from './SVGSimpleText';
import type {
  AxisOrientation,
  AxisScale,
  AxisStyles,
  LineProps,
  TextStyles,
  TickDatum,
  TickLabelAlignment
} from './types';
import { useAxisTransitions } from './useAxisTransitions';

export interface SVGAxisTicksProps {
  axisOrientation: AxisOrientation;
  scale: AxisScale;
  springConfig?: SpringConfig;
  animate?: boolean;
  renderingOffset: number;
  /** If true, will hide the ticks (but not the tick labels). */
  hideTicks?: boolean;
  /** Props to apply to the <g> element that wraps each tick line and label. */
  tickGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'style'>; // TODO think about removing style.
  /** The angle that the tick label will be rendered at. */
  tickLabelAlignment?: TickLabelAlignment;
  /** Padding between the tick lines and the tick labels. */
  tickLabelPadding?: number;
  /** The props to apply to the tick labels. */
  tickLabelProps?: Partial<TextProps>;
  /** The length of the tick lines. */
  tickLength?: number;
  /** Props to be applied to individual tick lines. */
  tickLineProps?: LineProps;
  ticks: readonly TickDatum[];
  labelStyles?: TextStyles;
  axisStyles?: AxisStyles;
}

export function SVGAxisTicks({
  scale,
  hideTicks = defaultHideTicks,
  axisOrientation,
  tickLabelProps = {},
  tickGroupProps,
  ticks,
  tickLength = defaultTickLength,
  tickLineProps,
  springConfig,
  animate = true,
  renderingOffset,
  tickLabelPadding = defaultTickLabelPadding,
  labelStyles,
  tickLabelAlignment = defaultTickLabelAngle,
  axisStyles
}: SVGAxisTicksProps) {
  const transitions = useAxisTransitions(scale, ticks, springConfig, animate, renderingOffset);
  const isVertical = axisOrientation === 'left' || axisOrientation === 'right';
  const tickTranslateAxis = isVertical ? 'translateY' : 'translateX';
  const tickLineAxis = isVertical ? 'x' : 'y';
  const tickSign = axisOrientation === 'left' || axisOrientation === 'top' ? -1 : 1;
  return (
    <>
      {transitions(({ opacity, translate }, { label }) => (
        <animated.g
          data-testid="axis-tick-group"
          {...tickGroupProps}
          style={{ opacity, [tickTranslateAxis]: translate }}
        >
          {!hideTicks && tickLength > 0 && (
            <SVGAxisTickLine
              {...{ [tickLineAxis + '2']: tickSign * tickLength }}
              lineStyles={axisStyles?.tickLine}
              {...tickLineProps}
            />
          )}
          <SVGAxisTickLabel
            axisOrientation={axisOrientation}
            label={label}
            hideTicks={hideTicks}
            labelProps={tickLabelProps}
            tickLength={tickLength}
            labelPadding={tickLabelPadding}
            labelStyles={labelStyles}
            labelAlignment={tickLabelAlignment}
          />
        </animated.g>
      ))}
    </>
  );
}
