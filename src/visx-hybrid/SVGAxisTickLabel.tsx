import { combineFontPropertiesWithStyles } from './combineFontPropertiesWithStyles';
import { defaultSmallLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleText, TextProps } from './SVGSimpleText';
import type { Anchor, AxisOrientation, TextStyles, TickLabelAlignment } from './types';

function getTextAnchor(axisOrientation: AxisOrientation, labelAlignment: TickLabelAlignment): Anchor {
  let textAnchor: Anchor = 'middle';
  if (labelAlignment === 'vertical') {
    if (axisOrientation === 'top') {
      textAnchor = 'start';
    } else if (axisOrientation === 'bottom') {
      textAnchor = 'end';
    }
  } else if (labelAlignment === 'horizontal') {
    if (axisOrientation === 'left') {
      textAnchor = 'end';
    } else if (axisOrientation === 'right') {
      textAnchor = 'start';
    }
  } else if (labelAlignment === 'angled') {
    // TODO consolidate
    if (axisOrientation === 'top') {
      textAnchor = 'start';
    } else if (axisOrientation === 'bottom') {
      textAnchor = 'end';
    } else if (axisOrientation === 'left') {
      textAnchor = 'end';
    } else if (axisOrientation === 'right') {
      textAnchor = 'start';
    }
  }
  return textAnchor;
}

function getVerticalTextAnchor(
  axisOrientation: AxisOrientation,
  tickLabelAlignment: TickLabelAlignment
): Anchor {
  let verticalAnchor: Anchor = 'middle';
  if (axisOrientation === 'left' || axisOrientation === 'right') {
    if (tickLabelAlignment === 'vertical') {
      verticalAnchor = 'end';
    }
  } else if (axisOrientation === 'top') {
    if (tickLabelAlignment === 'horizontal') {
      verticalAnchor = 'end';
    }
  } else if (axisOrientation === 'bottom') {
    if (tickLabelAlignment === 'horizontal') {
      verticalAnchor = 'start';
    }
  }
  return verticalAnchor;
}

function getTextAngle(axisOrientation: AxisOrientation, tickLabelAlignment: TickLabelAlignment): number {
  let angle = 0;
  if (tickLabelAlignment === 'vertical') {
    if (axisOrientation === 'right') {
      angle = 90;
    } else {
      angle = -90;
    }
  } else if (tickLabelAlignment === 'angled') {
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
  labelAlignment: TickLabelAlignment;
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
  labelAlignment
}: SVGAxisTickLabelProps) {
  const fontMetrics = getFontMetricsWithCache(labelStyles?.font ?? defaultSmallLabelsFont);
  const isVerticalAxis = axisOrientation === 'left' || axisOrientation === 'right';
  const tickLineAxis = isVerticalAxis ? 'x' : 'y';
  const tickSign = axisOrientation === 'left' || axisOrientation === 'top' ? -1 : 1;
  const { style: labelPropsStyle, className: labelPropsClassname, ...restLabelProps } = labelProps;
  const style = combineFontPropertiesWithStyles(labelStyles?.font, labelPropsStyle);
  const textAnchor = getTextAnchor(axisOrientation, labelAlignment);
  const verticalAnchor = getVerticalTextAnchor(axisOrientation, labelAlignment);
  const angle = getTextAngle(axisOrientation, labelAlignment);

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
