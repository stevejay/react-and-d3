import { combineFontPropertiesWithStyles } from './combineFontPropertiesWithStyles';
import { defaultSmallLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleText, TextProps } from './SVGSimpleText';
import type { Anchor, AxisOrientation, TextStyles, TickLabelAngle } from './types';

function getTextAnchor(axisOrientation: AxisOrientation, labelAngle: TickLabelAngle): Anchor {
  let textAnchor: Anchor = 'middle';
  if (labelAngle === 'vertical') {
    if (axisOrientation === 'top') {
      textAnchor = 'start';
    } else if (axisOrientation === 'bottom') {
      textAnchor = 'end';
    }
  } else if (labelAngle === 'horizontal') {
    if (axisOrientation === 'left') {
      textAnchor = 'end';
    } else if (axisOrientation === 'right') {
      textAnchor = 'start';
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

export interface SVGAxisTickLabelProps {
  /** The tick label. */
  label: string;
  /** The orientation of the axis. */
  axisOrientation: AxisOrientation;
  labelStyles?: TextStyles;
  /** Whether the axis ticks should be hidden. (The tick labels will always be shown.) Optional. Defaults to `false`. */
  hideTicks?: boolean;
  /** The angle that the tick label will be rendered at. */
  labelAngle: TickLabelAngle;
  /** Padding between the tick lines and the tick labels. */
  labelPadding: number;
  /** The props to apply to the tick labels. */
  labelProps?: Partial<TextProps>; // Partial<Omit<TextProps, 'verticalAnchor' | 'textAnchor'>>;
  /** The length of the tick lines. */
  tickLength: number;
}

export function SVGAxisTickLabel({
  label,
  hideTicks,
  axisOrientation,
  labelProps = {},
  tickLength,
  labelPadding,
  labelStyles,
  labelAngle
}: SVGAxisTickLabelProps) {
  const fontMetrics = getFontMetricsWithCache(labelStyles?.font ?? defaultSmallLabelsFont);
  const isVerticalAxis = axisOrientation === 'left' || axisOrientation === 'right';
  const tickLineAxis = isVerticalAxis ? 'x' : 'y';
  const tickSign = axisOrientation === 'left' || axisOrientation === 'top' ? -1 : 1;
  const { style: labelPropsStyle, className: labelPropsClassname, ...restLabelProps } = labelProps;
  const style = combineFontPropertiesWithStyles(labelStyles?.font, labelPropsStyle);
  const textAnchor = getTextAnchor(axisOrientation, labelAngle);
  const verticalAnchor = getVerticalTextAnchor(axisOrientation, labelAngle);
  const angle = getTextAngle(axisOrientation, labelAngle);

  return (
    <SVGSimpleText
      textAnchor={textAnchor}
      verticalAnchor={verticalAnchor}
      angle={angle}
      x={0}
      y={0}
      // The following overrides either the x or the y prop value:
      {...{
        [tickLineAxis]: tickSign * ((hideTicks ? 0 : tickLength) + labelPadding)
      }}
      role="presentation"
      aria-hidden
      fill={restLabelProps?.fill ?? labelStyles?.fill ?? 'currentColor'}
      fontHeight={fontMetrics.height}
      fontHeightFromBaseline={fontMetrics.heightFromBaseline}
      style={style}
      className={`${labelStyles?.className ?? ''} ${labelPropsClassname ?? ''}`}
      {...restLabelProps}
    >
      {label}
    </SVGSimpleText>
  );
}
