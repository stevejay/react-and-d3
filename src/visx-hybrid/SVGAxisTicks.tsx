import { animated } from 'react-spring';

import {
  defaultHideTicks,
  defaultTickLabelAngle,
  defaultTickLabelPadding,
  defaultTickLength
} from './constants';
import { AxisRendererProps } from './SVGAxis';
import { SVGAxisTickLabel } from './SVGAxisTickLabel';
import { SVGAxisTickLine } from './SVGAxisTickLine';
import type { ThemeLabelStyles, TickDatum } from './types';
import { useAxisTransitions } from './useAxisTransitions';

export type SVGAxisTicksProps = Pick<
  AxisRendererProps,
  | 'hideTicks'
  | 'orientation'
  | 'scale'
  | 'margin'
  | 'tickLineProps'
  | 'springConfig'
  | 'animate'
  | 'renderingOffset'
  | 'tickLength'
  | 'tickLabelPadding'
  | 'tickGroupProps'
  | 'tickLabelProps'
  | 'tickLabelAngle'
> & { ticks: TickDatum[]; labelStyles?: ThemeLabelStyles };

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
