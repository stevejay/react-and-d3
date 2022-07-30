import type { CSSProperties } from 'react';

import { defaultSmallLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleText, TextProps } from './SVGSimpleText';
import type { Anchor, AxisOrientation, FontProperties, TextStyles, TickLabelAngle } from './types';

function getTextAnchor(axisOrientation: AxisOrientation, tickLabelAngle: TickLabelAngle): Anchor {
  let textAnchor: Anchor = 'middle';
  if (axisOrientation === 'left') {
    if (tickLabelAngle !== 'vertical') {
      textAnchor = 'end';
    }
  } else if (axisOrientation === 'right') {
    if (tickLabelAngle !== 'vertical') {
      textAnchor = 'start';
    }
  } else if (axisOrientation === 'top') {
    if (tickLabelAngle === 'vertical') {
      textAnchor = 'start';
    }
  } else if (axisOrientation === 'bottom') {
    if (tickLabelAngle === 'vertical') {
      textAnchor = 'end';
    }
  }
  return textAnchor;
}

function getVerticalTextAnchor(axisOrientation: AxisOrientation, tickLabelAngle: TickLabelAngle): Anchor {
  let verticalAnchor: Anchor = 'middle';
  if (axisOrientation === 'left' || axisOrientation === 'right') {
    if (tickLabelAngle === 'vertical') {
      verticalAnchor = 'end';
    }
  } else if (axisOrientation === 'top') {
    verticalAnchor = 'end';
  } else if (axisOrientation === 'bottom') {
    verticalAnchor = 'start';
  }
  return verticalAnchor;
}

function getTextAngle(axisOrientation: AxisOrientation, tickLabelAngle: TickLabelAngle): number {
  let angle = 0;
  if (tickLabelAngle === 'vertical') {
    if (axisOrientation === 'right') {
      angle = 90;
    } else {
      angle = -90;
    }
  } else if (tickLabelAngle === 'angled') {
    angle = -45;
  }
  return angle;
}

function combineStyles(font: string | FontProperties | undefined, style: CSSProperties | undefined) {
  if (typeof font === 'string') {
    return { font, ...style };
  } else if (font) {
    return { ...font, ...style };
  } else {
    return style;
  }
}

export interface SVGAxisTickLabelProps {
  /** The tick label. */
  label: string;
  /** The orientation of the axis. */
  axisOrientation: AxisOrientation;
  labelStyles?: TextStyles;
  /** Whether the axis ticks should be hidden. (The tick labels will always be shown.) Optional. Defaults to `false`. */
  hideTicks?: boolean;
  /** The angle that the tick label will be rendered at. */
  tickLabelAngle: TickLabelAngle;
  /** Padding between the tick lines and the tick labels. */
  tickLabelPadding: number;
  /** The props to apply to the tick labels. */
  tickLabelProps?: Partial<TextProps>; // Partial<Omit<TextProps, 'verticalAnchor' | 'textAnchor'>>;
  /** The length of the tick lines. */
  tickLength: number;
}

export function SVGAxisTickLabel({
  label,
  hideTicks,
  axisOrientation,
  tickLabelProps = {},
  tickLength,
  tickLabelPadding,
  labelStyles,
  tickLabelAngle
}: SVGAxisTickLabelProps) {
  const fontMetrics = getFontMetricsWithCache(labelStyles?.font ?? defaultSmallLabelsFont);
  const isVerticalAxis = axisOrientation === 'left' || axisOrientation === 'right';
  const tickLineAxis = isVerticalAxis ? 'x' : 'y';
  const tickSign = axisOrientation === 'left' || axisOrientation === 'top' ? -1 : 1;
  const {
    style: labelPropsStyle,
    className: labelPropsClassname = '',
    ...restTickLabelProps
  } = tickLabelProps;
  const style = combineStyles(labelStyles?.font, labelPropsStyle);
  const textAnchor = getTextAnchor(axisOrientation, tickLabelAngle);
  const verticalAnchor = getVerticalTextAnchor(axisOrientation, tickLabelAngle);
  const angle = getTextAngle(axisOrientation, tickLabelAngle);
  return (
    <SVGSimpleText
      textAnchor={textAnchor}
      verticalAnchor={verticalAnchor}
      angle={angle}
      x={0}
      y={0}
      {...{
        [tickLineAxis]: tickSign * ((hideTicks ? 0 : tickLength) + tickLabelPadding)
      }}
      role="presentation"
      aria-hidden
      fill={restTickLabelProps?.fill ?? labelStyles?.fill ?? 'currentColor'}
      fontHeight={fontMetrics.height}
      fontHeightFromBaseline={fontMetrics.heightFromBaseline}
      style={style}
      className={`${labelStyles?.className ?? ''} ${labelPropsClassname ?? ''}`}
      {...restTickLabelProps}
    >
      {label}
    </SVGSimpleText>
  );
}
