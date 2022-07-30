import { combineFontPropertiesWithStyles } from './combineFontPropertiesWithStyles';
import { defaultBigLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleText, TextProps } from './SVGSimpleText';
import type { Anchor, AxisOrientation, AxisScale, LabelAngle, TextStyles } from './types';

function getX(axisOrientation: AxisOrientation, range: [number, number], width: number): number {
  let x = 0;
  if (axisOrientation === 'top' || axisOrientation === 'bottom') {
    x = (Number(range[0]) + Number(range[1])) * 0.5;
  } else if (axisOrientation === 'right') {
    x = width;
  }
  return x;
}

function getY(axisOrientation: AxisOrientation, range: [number, number], height: number): number {
  let y = 0;
  if (axisOrientation === 'left' || axisOrientation === 'right') {
    y = (Number(range[0]) + Number(range[1])) * 0.5;
  } else if (axisOrientation === 'bottom') {
    y = height;
  }
  return y;
}

function getTextAnchor(axisOrientation: AxisOrientation, labelAngle: LabelAngle): Anchor {
  let textAnchor: Anchor = 'middle';
  if (labelAngle === 'vertical') {
    if (axisOrientation === 'top') {
      textAnchor = 'end';
    } else if (axisOrientation === 'bottom') {
      textAnchor = 'start';
    }
  } else if (labelAngle === 'horizontal') {
    if (axisOrientation === 'left') {
      textAnchor = 'start';
    } else if (axisOrientation === 'right') {
      textAnchor = 'end';
    }
  }
  return textAnchor;
}

function getVerticalAnchor(axisOrientation: AxisOrientation, labelAngle: LabelAngle): Anchor {
  let verticalAnchor: Anchor = 'start';
  if (axisOrientation === 'left' || axisOrientation === 'right') {
    if (labelAngle === 'horizontal') {
      verticalAnchor = 'middle';
    }
  } else if (axisOrientation === 'top') {
    if (labelAngle === 'vertical') {
      verticalAnchor = 'middle';
    }
  } else if (axisOrientation === 'bottom') {
    if (labelAngle === 'horizontal') {
      verticalAnchor = 'end';
    } else {
      verticalAnchor = 'middle';
    }
  }
  return verticalAnchor;
}

export interface SVGAxisLabelProps {
  label: string;
  axisOrientation: AxisOrientation;
  labelStyles: TextStyles;
  /** Props to apply to the axis label. */
  labelProps?: TextProps;
  scale: AxisScale;
  rangePadding: number;
  width: number;
  height: number;
  labelAngle: LabelAngle;
}

// Note: Does not use labelPadding as it renders the axis labels flush against the edges of the chart.
export function SVGAxisLabel({
  label,
  labelProps = {},
  axisOrientation,
  scale,
  rangePadding,
  width,
  height,
  labelAngle,
  labelStyles
}: SVGAxisLabelProps) {
  const fontMetrics = getFontMetricsWithCache(labelStyles?.font ?? defaultBigLabelsFont);
  const { style: labelPropsStyle, className: labelPropsClassname, ...restLabelProps } = labelProps;
  const style = combineFontPropertiesWithStyles(labelStyles?.font, labelPropsStyle);
  const isVertical = axisOrientation === 'left' || axisOrientation === 'right';
  const rangeFrom = Number(scale.range()[0]) ?? 0;
  const rangeTo = Number(scale.range()[1]) ?? 0;
  const innerRange: [number, number] = isVertical
    ? [rangeFrom + rangePadding, rangeTo - rangePadding]
    : [rangeFrom - rangePadding, rangeTo + rangePadding];
  const x = getX(axisOrientation, innerRange, width);
  const y = getY(axisOrientation, innerRange, height);
  const textAnchor: Anchor = getTextAnchor(axisOrientation, labelAngle);
  const verticalAnchor: Anchor = getVerticalAnchor(axisOrientation, labelAngle);
  const angle = labelAngle === 'horizontal' ? 0 : axisOrientation === 'right' ? 90 : -90;

  return (
    <SVGSimpleText
      textAnchor={textAnchor}
      verticalAnchor={verticalAnchor}
      angle={angle}
      x={x}
      y={y}
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
