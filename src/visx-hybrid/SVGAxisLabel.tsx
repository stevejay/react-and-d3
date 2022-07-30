import { defaultLabelTextProps, defaultTheme } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleText, TextProps } from './SVGSimpleText';
import type { Anchor, AxisOrientation, AxisScale, LabelAngle, ThemeLabelStyles } from './types';

function getX(orientation: AxisOrientation, range: [number, number], width: number): number {
  let x = 0;
  if (orientation === 'top' || orientation === 'bottom') {
    x = (Number(range[0]) + Number(range[1])) * 0.5;
  } else if (orientation === 'right') {
    x = width;
  }
  return x;
}

function getY(orientation: AxisOrientation, range: [number, number], height: number): number {
  let y = 0;
  if (orientation === 'left' || orientation === 'right') {
    y = (Number(range[0]) + Number(range[1])) * 0.5;
  } else if (orientation === 'bottom') {
    y = height;
  }
  return y;
}

function getTextAnchor(orientation: AxisOrientation, labelAngle: LabelAngle): Anchor {
  let textAnchor: Anchor = 'middle';
  if (labelAngle === 'vertical') {
    if (orientation === 'top') {
      textAnchor = 'end';
    } else if (orientation === 'bottom') {
      textAnchor = 'start';
    }
  } else if (labelAngle === 'horizontal') {
    if (orientation === 'left') {
      textAnchor = 'start';
    } else if (orientation === 'right') {
      textAnchor = 'end';
    }
  }
  return textAnchor;
}

function getVerticalAnchor(orientation: AxisOrientation, labelAngle: LabelAngle): Anchor {
  let verticalAnchor: Anchor = 'start';
  if (orientation === 'left' || orientation === 'right') {
    if (labelAngle === 'horizontal') {
      verticalAnchor = 'middle';
    }
  } else if (orientation === 'top') {
    if (labelAngle === 'vertical') {
      verticalAnchor = 'middle';
    }
  } else if (orientation === 'bottom') {
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
  orientation: AxisOrientation;
  labelStyles?: ThemeLabelStyles;
  /** Props to apply to the axis label. */
  labelProps?: TextProps;
  scale: AxisScale;
  rangePadding: number;
  width: number;
  height: number;
  labelAngle: LabelAngle;
}

// height: 20, heightFromBaseline: 16}

// Note: Does not currently use labelPadding as it renders the axis labels flush against
// the edges of the chart.
export function SVGAxisLabel({
  label,
  labelProps = {},
  orientation,
  scale,
  rangePadding,
  width,
  height,
  labelAngle,
  labelStyles = defaultTheme.bigLabels
}: SVGAxisLabelProps) {
  // Calculate the dimensions of the axis label (if there is one):
  const fontMetrics = getFontMetricsWithCache(labelStyles?.font ?? defaultLabelTextProps);
  const { style: labelPropsStyle, className: labelPropsClassname = '', ...restLabelProps } = labelProps;
  const style =
    typeof labelStyles?.font === 'string' ? { font: labelStyles?.font, ...labelPropsStyle } : labelPropsStyle;
  const isVertical = orientation === 'left' || orientation === 'right';
  const rangeFrom = Number(scale.range()[0]) ?? 0;
  const rangeTo = Number(scale.range()[1]) ?? 0;
  const innerRange: [number, number] = isVertical
    ? [rangeFrom + rangePadding, rangeTo - rangePadding]
    : [rangeFrom - rangePadding, rangeTo + rangePadding];

  // let x = 0;
  // let y = 0;
  // let transform: string | undefined = undefined;
  // let textAnchor: Anchor = 'middle';

  // if (orientation === 'top') {
  //   if (labelAngle === 'horizontal') {
  //     x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //     y = labelMeasurements.heightFromBaseline;
  //   } else {
  //     // Vertical.
  //     x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //     y = 0;
  //     textAnchor = 'end';
  //     transform = `rotate(${-90}, ${
  //       (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5
  //     }, ${0})`;
  //   }
  // } else if (orientation === 'bottom') {
  //   if (labelAngle === 'horizontal') {
  //     x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //     y = height - (labelMeasurements.height - labelMeasurements.heightFromBaseline);
  //   } else {
  //     // Vertical.
  //     x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //     y = height;
  //     textAnchor = 'start';
  //     transform = `rotate(${-90}, ${
  //       (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5
  //     }, ${height})`;
  //   }
  // } else if (orientation === 'left') {
  //   if (labelAngle === 'vertical') {
  //     x = labelMeasurements.heightFromBaseline;
  //     y = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //     transform = `rotate(${-90}, ${labelMeasurements.heightFromBaseline}, ${
  //       (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5
  //     })`;
  //   } else {
  //     x = 0;
  //     y =
  //       (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5 -
  //       labelMeasurements.height * 0.5 +
  //       labelMeasurements.heightFromBaseline;
  //     textAnchor = 'start';
  //   }
  // } else {
  //   // Right.
  //   if (labelAngle === 'vertical') {
  //     x = width - labelMeasurements.heightFromBaseline;
  //     y = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //     transform = `rotate(${90}, ${width - labelMeasurements.heightFromBaseline}, ${
  //       (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5
  //     })`;
  //   } else {
  //     x = width;
  //     y =
  //       (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5 -
  //       labelMeasurements.height * 0.5 +
  //       labelMeasurements.heightFromBaseline;
  //     textAnchor = 'end';
  //   }
  // }

  const x = getX(orientation, innerRange, width);
  const y = getY(orientation, innerRange, height);
  const textAnchor: Anchor = getTextAnchor(orientation, labelAngle);
  const verticalAnchor: Anchor = getVerticalAnchor(orientation, labelAngle);
  const angle = labelAngle === 'horizontal' ? 0 : orientation === 'right' ? 90 : -90;

  // if (orientation === 'top') {
  //   // x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //   if (labelAngle === 'vertical') {
  //     // textAnchor = 'end';
  //     verticalAnchor = 'middle';
  //   }
  // } else if (orientation === 'bottom') {
  //   // x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //   // y = height;
  //   if (labelAngle === 'horizontal') {
  //     verticalAnchor = 'end';
  //   } else {
  //     // textAnchor = 'start';
  //     verticalAnchor = 'middle';
  //   }
  // } else if (orientation === 'left') {
  //   // x = 0;
  //   // y = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //   // if (labelAngle === 'horizontal') {
  //   //   // textAnchor = 'start';
  //   //   verticalAnchor = 'middle';
  //   // }
  // } else if (orientation === 'right') {
  //   // x = width;
  //   // y = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //   // if (labelAngle === 'horizontal') {
  //   //   // textAnchor = 'end';
  //   //   verticalAnchor = 'middle';
  //   // }
  // }

  return (
    <SVGSimpleText
      fill={labelStyles?.fill ?? 'currentColor'}
      textAnchor={textAnchor}
      verticalAnchor={verticalAnchor}
      angle={angle}
      x={x}
      y={y}
      fontHeight={fontMetrics.height}
      fontHeightFromBaseline={fontMetrics.heightFromBaseline}
      style={style}
      className={`${labelStyles?.className ?? ''} ${labelPropsClassname}`}
      {...restLabelProps}
    >
      {label}
    </SVGSimpleText>
  );

  // return (
  //   <text
  //     data-testid={`axis-label-${orientation}`}
  //     role="presentation"
  //     aria-hidden
  //     textAnchor={textAnchor}
  //     style={style}
  //     x={x}
  //     y={y}
  //     transform={transform}
  //     fill={labelStyles?.fill ?? 'currentColor'}
  //     className={`${labelStyles?.className ?? ''} ${labelPropsClassname}`}
  //     {...restLabelProps}
  //   >
  //     {label}
  //   </text>
  // );
}
