import { CSSProperties } from 'react';

import { defaultBigLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleText, TextProps } from './SVGSimpleText';
import type { Anchor, AxisOrientation, AxisScale, FontProperties, LabelAngle, TextStyles } from './types';

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

function combineStyles(font: string | FontProperties | undefined, style: CSSProperties | undefined) {
  if (typeof font === 'string') {
    return { font, ...style };
  } else if (font) {
    return { ...font, ...style };
  } else {
    return style;
  }
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

// Note: Does not currently use labelPadding as it renders the axis labels flush against
// the edges of the chart.
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
  const style = combineStyles(labelStyles?.font, labelPropsStyle);
  const isVertical = axisOrientation === 'left' || axisOrientation === 'right';
  const rangeFrom = Number(scale.range()[0]) ?? 0;
  const rangeTo = Number(scale.range()[1]) ?? 0;
  const innerRange: [number, number] = isVertical
    ? [rangeFrom + rangePadding, rangeTo - rangePadding]
    : [rangeFrom - rangePadding, rangeTo + rangePadding];

  // let x = 0;
  // let y = 0;
  // let transform: string | undefined = undefined;
  // let textAnchor: Anchor = 'middle';

  // if (axisOrientation === 'top') {
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
  // } else if (axisOrientation === 'bottom') {
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
  // } else if (axisOrientation === 'left') {
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

  const x = getX(axisOrientation, innerRange, width);
  const y = getY(axisOrientation, innerRange, height);
  const textAnchor: Anchor = getTextAnchor(axisOrientation, labelAngle);
  const verticalAnchor: Anchor = getVerticalAnchor(axisOrientation, labelAngle);
  const angle = labelAngle === 'horizontal' ? 0 : axisOrientation === 'right' ? 90 : -90;

  // if (axisOrientation === 'top') {
  //   // x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //   if (labelAngle === 'vertical') {
  //     // textAnchor = 'end';
  //     verticalAnchor = 'middle';
  //   }
  // } else if (axisOrientation === 'bottom') {
  //   // x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //   // y = height;
  //   if (labelAngle === 'horizontal') {
  //     verticalAnchor = 'end';
  //   } else {
  //     // textAnchor = 'start';
  //     verticalAnchor = 'middle';
  //   }
  // } else if (axisOrientation === 'left') {
  //   // x = 0;
  //   // y = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //   // if (labelAngle === 'horizontal') {
  //   //   // textAnchor = 'start';
  //   //   verticalAnchor = 'middle';
  //   // }
  // } else if (axisOrientation === 'right') {
  //   // x = width;
  //   // y = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
  //   // if (labelAngle === 'horizontal') {
  //   //   // textAnchor = 'end';
  //   //   verticalAnchor = 'middle';
  //   // }
  // }

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

  // return (
  //   <text
  //     data-testid={`axis-label-${axisOrientation}`}
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
