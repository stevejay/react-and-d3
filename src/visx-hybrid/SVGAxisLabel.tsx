import { combineFontPropertiesWithStyles } from './combineFontPropertiesWithStyles';
import { defaultBigLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleText, TextProps } from './SVGSimpleText';
import type {
  AxisOrientation,
  ChartArea,
  IChartDimensions,
  LabelAlignment,
  TextAnchor,
  TextStyles
} from './types';

function getX(axisOrientation: AxisOrientation, range: [number, number], outerMarginArea: ChartArea): number {
  let x = 0;
  if (axisOrientation === 'top' || axisOrientation === 'bottom') {
    x = (Number(range[0]) + Number(range[1])) * 0.5;
  } else if (axisOrientation === 'left') {
    x = outerMarginArea.x;
  } else if (axisOrientation === 'right') {
    x = outerMarginArea.x1;
  }
  return x;
}

function getY(axisOrientation: AxisOrientation, range: [number, number], outerMarginArea: ChartArea): number {
  let y = 0;
  if (axisOrientation === 'left' || axisOrientation === 'right') {
    y = (Number(range[0]) + Number(range[1])) * 0.5;
  } else if (axisOrientation === 'top') {
    y = outerMarginArea.y;
  } else if (axisOrientation === 'bottom') {
    y = outerMarginArea.y1;
  }
  return y;
}

function getTextAnchor(axisOrientation: AxisOrientation, labelAlignment: LabelAlignment): TextAnchor {
  let textAnchor: TextAnchor = 'middle';
  if (labelAlignment === 'vertical') {
    if (axisOrientation === 'top') {
      textAnchor = 'end';
    } else if (axisOrientation === 'bottom') {
      textAnchor = 'start';
    }
  } else if (labelAlignment === 'horizontal') {
    if (axisOrientation === 'left') {
      textAnchor = 'start';
    } else if (axisOrientation === 'right') {
      textAnchor = 'end';
    }
  }
  return textAnchor;
}

function getVerticalAnchor(axisOrientation: AxisOrientation, labelAlignment: LabelAlignment): TextAnchor {
  let verticalAnchor: TextAnchor = 'start';
  if (axisOrientation === 'left' || axisOrientation === 'right') {
    if (labelAlignment === 'horizontal') {
      verticalAnchor = 'middle';
    }
  } else if (axisOrientation === 'top') {
    if (labelAlignment === 'vertical') {
      verticalAnchor = 'middle';
    }
  } else if (axisOrientation === 'bottom') {
    if (labelAlignment === 'horizontal') {
      verticalAnchor = 'end';
    } else {
      verticalAnchor = 'middle';
    }
  }
  return verticalAnchor;
}

function getAngle(axisOrientation: AxisOrientation, labelAlignment: LabelAlignment): number {
  return labelAlignment === 'horizontal' ? 0 : axisOrientation === 'right' ? 90 : -90;
}

export interface SVGAxisLabelProps {
  label: string;
  axisOrientation: AxisOrientation;
  axisPathRange: [number, number];
  labelStyles: TextStyles;
  /** Props to apply to the axis label. */
  labelProps?: TextProps;
  chartDimensions: IChartDimensions;
  // width: number;
  // height: number;
  // outerMargin: Margin;
  labelAlignment: LabelAlignment;
}

// Note: Does not use labelPadding as it renders the axis labels flush against the edges of the chart.
export function SVGAxisLabel({
  label,
  labelProps = {},
  axisOrientation,
  axisPathRange,
  chartDimensions,
  labelAlignment,
  labelStyles
}: SVGAxisLabelProps) {
  const { style: labelPropsStyle, className: labelPropsClassname, ...restLabelProps } = labelProps;
  const fontMetrics = getFontMetricsWithCache(labelStyles?.font ?? defaultBigLabelsFont);
  const style = combineFontPropertiesWithStyles(labelStyles?.font, labelPropsStyle);
  const x = getX(axisOrientation, axisPathRange, chartDimensions.outerMarginArea);
  const y = getY(axisOrientation, axisPathRange, chartDimensions.outerMarginArea);
  const textAnchor: TextAnchor = getTextAnchor(axisOrientation, labelAlignment);
  const verticalAnchor: TextAnchor = getVerticalAnchor(axisOrientation, labelAlignment);
  const angle = getAngle(axisOrientation, labelAlignment);
  return (
    <SVGSimpleText
      data-testid={`axis-${axisOrientation}-label`}
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
