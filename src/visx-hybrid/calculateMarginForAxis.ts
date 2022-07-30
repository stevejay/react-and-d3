import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { getTicksData } from './getTicksData';
import { measureTextWithCache } from './measureTextWithCache';
import type {
  AxisOrientation,
  AxisScale,
  AxisScaleOutput,
  FontProperties,
  LabelAngle,
  Margin,
  ScaleInput,
  TickDatum,
  TickFormatter,
  TickLabelAngle
} from './types';

export interface MarginCalculationInput {
  axisOrientation: AxisOrientation;
  scale: AxisScale<AxisScaleOutput>;
  rangePadding: number;

  tickFormat?: TickFormatter<ScaleInput<AxisScale>>;
  tickCount?: number;
  tickValues?: ScaleInput<AxisScale>[];
  tickLength: number;
  hideTicks: boolean;
  hideZero: boolean;

  tickLabelPadding: number;
  tickLabelAngle: TickLabelAngle;
  smallFont: FontProperties | string;

  label?: string;
  labelPadding: number;
  labelAngle: LabelAngle;
  bigFont: FontProperties | string;
}

function getTickLineMargin(axisOrientation: AxisOrientation, tickLength: number, hideTicks: boolean): Margin {
  const tickDimension = hideTicks ? 0 : tickLength;
  switch (axisOrientation) {
    case 'left':
      return { left: tickDimension, right: 0, top: 0, bottom: 0 };
    case 'right':
      return { left: 0, right: tickDimension, top: 0, bottom: 0 };
    case 'top':
      return { left: 0, right: 0, top: tickDimension, bottom: 0 };
    default:
      return { left: 0, right: 0, top: 0, bottom: tickDimension };
  }
}

function getTickLabelsMargin(
  axisOrientation: AxisOrientation,
  rangePadding: number,
  ticks: TickDatum[],
  tickLabelPadding: number,
  tickLabelAngle: TickLabelAngle,
  font: FontProperties | string
): Margin {
  // Calculate the dimensions of each tick label:
  const widths = ticks.map((tick) => measureTextWithCache(tick.label, font));
  // Get the width of the longest tick label:
  const maxTickLabelWidth = Math.max(0, ...widths);
  // Get the height of the tallest tick label:
  const tickLabelHeight = getFontMetricsWithCache(font).height;

  if (axisOrientation === 'left' || axisOrientation === 'right') {
    if (tickLabelAngle === 'horizontal') {
      const width = maxTickLabelWidth + tickLabelPadding;
      const halfHeight = Math.ceil(tickLabelHeight * 0.5);
      if (axisOrientation === 'left') {
        return { left: width, right: 0, top: halfHeight - rangePadding, bottom: halfHeight - rangePadding };
      } else {
        return { left: 0, right: width, top: halfHeight - rangePadding, bottom: halfHeight - rangePadding };
      }
    } else if (tickLabelAngle === 'vertical') {
      const width = tickLabelHeight + tickLabelPadding;
      const halfHeight = Math.ceil(maxTickLabelWidth * 0.5);
      if (axisOrientation === 'left') {
        return { left: width, right: 0, top: halfHeight - rangePadding, bottom: halfHeight - rangePadding };
      } else {
        return { left: 0, right: width, top: halfHeight - rangePadding, bottom: halfHeight - rangePadding };
      }
    } else {
      // Angled.

      const sqrtOfTwo = Math.sqrt(2);
      // Find the length of a side of the square formed where the maxTickLabelWidth
      // is the hypotenuse of that square:
      const width = Math.ceil(sqrtOfTwo * (maxTickLabelWidth * 0.5));
      // Also find the equivalent side for the height of the label:
      const widthForHeight = sqrtOfTwo * (tickLabelHeight * 0.5);

      const halfHeight = Math.ceil(widthForHeight * 0.5);
      if (axisOrientation === 'left') {
        return {
          left: width + halfHeight + tickLabelPadding,
          right: 0,
          top: halfHeight - rangePadding,
          bottom: width + halfHeight - rangePadding
        };
      } else {
        return {
          left: 0,
          right: width + halfHeight + tickLabelPadding,
          top: width + halfHeight - rangePadding,
          bottom: halfHeight - rangePadding
        };
      }
    }
  } else {
    // 'top' or 'bottom'.

    if (tickLabelAngle === 'horizontal') {
      const halfWidth = Math.ceil(maxTickLabelWidth * 0.5);
      const height = tickLabelHeight + tickLabelPadding;
      if (axisOrientation === 'top') {
        return { left: halfWidth - rangePadding, right: halfWidth - rangePadding, top: height, bottom: 0 };
      } else {
        return { left: halfWidth - rangePadding, right: halfWidth - rangePadding, top: 0, bottom: height };
      }
    } else if (tickLabelAngle === 'vertical') {
      const halfWidth = Math.ceil(tickLabelHeight * 0.5);
      const height = maxTickLabelWidth + tickLabelPadding;
      if (axisOrientation === 'top') {
        return { left: halfWidth - rangePadding, right: halfWidth - rangePadding, top: height, bottom: 0 };
      } else {
        return { left: halfWidth - rangePadding, right: halfWidth - rangePadding, top: 0, bottom: height };
      }
    } else {
      // Angled.

      const sqrtOfTwo = Math.sqrt(2);
      // Find the length of a side of the square formed where the maxTickLabelWidth
      // is the hypotenuse of that square:
      const width = Math.ceil(sqrtOfTwo * (maxTickLabelWidth * 0.5));
      // Also find the equivalent side for the height of the label:
      const widthForHeight = sqrtOfTwo * (tickLabelHeight * 0.5);

      const halfHeight = Math.ceil(widthForHeight * 0.5);
      if (axisOrientation === 'top') {
        return {
          left: halfHeight - rangePadding,
          right: width + halfHeight - rangePadding,
          top: width + halfHeight + tickLabelPadding,
          bottom: 0
        };
      } else {
        return {
          left: width + halfHeight - rangePadding,
          right: halfHeight - rangePadding,
          top: 0,
          bottom: width + halfHeight + tickLabelPadding
        };
      }
    }
  }
}

// The dimensions consists of the label and the label padding.
function getLabelMargin(
  axisOrientation: AxisOrientation,
  label: string | undefined,
  labelPadding: number,
  labelAngle: LabelAngle,
  font: FontProperties | string
): Margin {
  if (!label) {
    return { left: 0, right: 0, top: 0, bottom: 0 };
  }
  const width = measureTextWithCache(label, font) + labelPadding;
  const height = getFontMetricsWithCache(font).height + labelPadding;

  switch (axisOrientation) {
    case 'left':
      return { left: labelAngle === 'horizontal' ? width : height, right: 0, top: 0, bottom: 0 };
    case 'right':
      return { left: 0, right: labelAngle === 'horizontal' ? width : height, top: 0, bottom: 0 };
    case 'top':
      return { left: 0, right: 0, top: labelAngle === 'horizontal' ? height : width, bottom: 0 };
    default:
      return { left: 0, right: 0, top: 0, bottom: labelAngle === 'horizontal' ? height : width };
  }
}

// Returns the required adjustments for the given axis data.
export function calculateMarginForAxis({
  axisOrientation,
  scale,
  rangePadding,
  bigFont,
  smallFont,
  hideZero,
  tickFormat,
  tickCount,
  tickValues,
  tickLength,
  hideTicks,
  tickLabelPadding,
  label,
  labelPadding,
  tickLabelAngle,
  labelAngle
}: MarginCalculationInput): Margin {
  // Calculate the ticks that we need to display for this axis:
  const ticks = getTicksData(scale, hideZero, tickFormat, tickCount, tickValues);
  const tickLineMargin = getTickLineMargin(axisOrientation, tickLength, hideTicks);
  const tickLabelsMargin = getTickLabelsMargin(
    axisOrientation,
    rangePadding,
    ticks,
    tickLabelPadding,
    tickLabelAngle,
    smallFont
  );
  const labelMargin = getLabelMargin(axisOrientation, label, labelPadding, labelAngle, bigFont);
  return {
    left: tickLineMargin.left + tickLabelsMargin.left + labelMargin.left,
    right: tickLineMargin.right + tickLabelsMargin.right + labelMargin.right,
    top: tickLineMargin.top + tickLabelsMargin.top + labelMargin.top,
    bottom: tickLineMargin.bottom + tickLabelsMargin.bottom + labelMargin.bottom
  };

  // Calculate the space taken up by the axis label and its offset (padding) value:
  // const labelDimension = label && labelMeasurements ? labelMeasurements.height + (labelPadding ?? 0) : 0;
  // Calculate the space taken up by a tick and its padding:
  // const tickDimension = hideTicks ? 0 : (tickLength ?? 0) + (tickLabelPadding ?? 0);

  // Calculate the dimensions of each tick label:
  // const tickLabelsMeasurements = ticks.map((tick) => measureTextWithCache(tick.label, tickLabelTextProps));
  // Get the width of the longest tick label:
  // const maxTickLabelWidth = maxBy(tickLabelsMeasurements, (x) => x.width)?.width ?? 0;
  // Use first label to get the height of a tick label:
  // const tickLabelHeight = tickLabelsMeasurements.length ? tickLabelsMeasurements[0].height : 0;

  // if (axisOrientation === 'left' || axisOrientation === 'right') {
  //   // Allow for a tick label being right at the top or bottom of this vertical axis.
  //   // const halfTickLabelHeight = Math.ceil(tickLabelHeight * 0.5);

  //   if (axisOrientation === 'left') {
  //     return {
  //       left: tickLineDimensions.width + tickLabelsMargin.left + labelDimensions.width,
  //       right: 0,
  //       top: tickLineDimensions.height + tickLabelsMargin.top + labelDimensions.height,
  //       bottom: halfTickLabelHeight
  //     };
  //   } else {
  //     return {
  //       left: 0,
  //       right: Math.ceil(tickDimension + maxTickLabelWidth + labelDimension),
  //       top: halfTickLabelHeight,
  //       bottom: halfTickLabelHeight
  //     };
  //   }
  // } else {
  //   // Allow for a tick label being right at the left or right of this horizontal axis.
  //   // const halfTickLabelWidth = Math.ceil(maxTickLabelWidth * 0.5);

  //   if (axisOrientation === 'top') {
  //     return {
  //       left: halfTickLabelWidth,
  //       right: halfTickLabelWidth,
  //       top: Math.ceil(tickDimension + tickLabelHeight + labelDimension),
  //       bottom: 0
  //     };
  //   } else {
  //     return {
  //       left: halfTickLabelWidth,
  //       right: halfTickLabelWidth,
  //       top: 0,
  //       bottom: Math.ceil(tickDimension + tickLabelHeight + labelDimension)
  //     };
  //   }
  // }
}
