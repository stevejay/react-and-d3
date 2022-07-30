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
  LineProps,
  Margin,
  ThemeLabelStyles,
  TickDatum,
  TickLabelAngle
} from './types';
import { useAxisTransitions } from './useAxisTransitions';

export interface SVGAxisTicksProps {
  orientation: AxisOrientation;
  scale: AxisScale;
  margin: Margin;
  springConfig?: SpringConfig;
  animate?: boolean;
  renderingOffset?: number;
  /** If true, will hide the ticks (but not the tick labels). */
  hideTicks?: boolean;
  /** Props to apply to the <g> element that wraps each tick line and label. */
  tickGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'style'>; // TODO think about removing style.
  /** The angle that the tick label will be rendered at. */
  tickLabelAngle?: TickLabelAngle;
  /** Padding between the tick lines and the tick labels. */
  tickLabelPadding?: number;
  /** The props to apply to the tick labels. */
  tickLabelProps?: Partial<TextProps>;
  /** The length of the tick lines. */
  tickLength?: number;
  /** Props to be applied to individual tick lines. */
  tickLineProps?: LineProps;
  ticks: TickDatum[];
  labelStyles?: ThemeLabelStyles;
}

export function SVGAxisTicks({
  scale,
  hideTicks = defaultHideTicks,
  orientation,
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
  tickLabelAngle = defaultTickLabelAngle
}: SVGAxisTicksProps) {
  const transitions = useAxisTransitions(scale, ticks, springConfig, animate, renderingOffset);
  const isVertical = orientation === 'left' || orientation === 'right';
  const tickTranslateAxis = isVertical ? 'translateY' : 'translateX';
  const tickLineAxis = isVertical ? 'x' : 'y';
  const tickSign = orientation === 'left' || orientation === 'top' ? -1 : 1;

  return (
    <>
      {transitions(({ opacity, translate }, { label }) => (
        <animated.g
          data-testid="axis-tick-group"
          {...tickGroupProps}
          style={{ opacity, [tickTranslateAxis]: translate }}
        >
          {!hideTicks && (
            <SVGAxisTickLine {...{ [tickLineAxis + '2']: tickSign * tickLength }} {...tickLineProps} />
          )}
          <SVGAxisTickLabel
            orientation={orientation}
            label={label}
            hideTicks={hideTicks}
            tickLabelProps={tickLabelProps}
            tickLength={tickLength}
            tickLabelPadding={tickLabelPadding}
            labelStyles={labelStyles}
            tickLabelAngle={tickLabelAngle}
          />
        </animated.g>
      ))}
    </>
  );
}
