import { addMargins } from './addMargins';
import { calculateTicksData } from './calculateTicksData';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { measureTextWithCache } from './measureTextWithCache';
import type { Margin, MarginCalculationParams, TickDatum } from './types';

function getTickLineMargin({ axisOrientation, tickLength, hideTicks }: MarginCalculationParams): Margin {
  const result: Margin = { left: 0, right: 0, top: 0, bottom: 0 };
  result[axisOrientation] = hideTicks ? 0 : tickLength;
  return result;
}

function getTickLabelsMargin(
  { axisOrientation, rangePadding, tickLabelPadding, tickLabelAngle, smallFont }: MarginCalculationParams,
  ticks: readonly TickDatum[]
): Margin {
  // Calculate the dimensions of each tick label:
  const widths = ticks.map((tick) => measureTextWithCache(tick.label, smallFont));
  // Get the width of the longest tick label:
  const maxTickLabelWidth = Math.max(0, ...widths);
  // Get the height of the tick labels:
  const tickLabelHeight = getFontMetricsWithCache(smallFont).height;

  if (axisOrientation === 'left' || axisOrientation === 'right') {
    if (tickLabelAngle === 'angled') {
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
    } else {
      let width = 0;
      let halfHeight = 0;
      if (tickLabelAngle === 'horizontal') {
        width = maxTickLabelWidth + tickLabelPadding;
        halfHeight = Math.ceil(tickLabelHeight * 0.5);
      } else {
        width = tickLabelHeight + tickLabelPadding;
        halfHeight = Math.ceil(maxTickLabelWidth * 0.5);
      }
      return {
        left: axisOrientation === 'left' ? width : 0,
        right: axisOrientation === 'right' ? width : 0,
        top: halfHeight - rangePadding,
        bottom: halfHeight - rangePadding
      };
    }
  } else {
    // 'top' or 'bottom'.
    if (tickLabelAngle === 'angled') {
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
    } else {
      let halfWidth = 0;
      let height = 0;
      if (tickLabelAngle === 'horizontal') {
        halfWidth = Math.ceil(maxTickLabelWidth * 0.5);
        height = tickLabelHeight + tickLabelPadding;
      } else if (tickLabelAngle === 'vertical') {
        halfWidth = Math.ceil(tickLabelHeight * 0.5);
        height = maxTickLabelWidth + tickLabelPadding;
      }
      return {
        left: halfWidth - rangePadding,
        right: halfWidth - rangePadding,
        top: axisOrientation === 'top' ? height : 0,
        bottom: axisOrientation === 'bottom' ? height : 0
      };
    }
  }
}

// The dimensions consists of the label and the label padding.
function getLabelMargin({
  axisOrientation,
  label,
  labelPadding,
  labelAngle,
  bigFont
}: MarginCalculationParams): Margin {
  const result: Margin = { left: 0, right: 0, top: 0, bottom: 0 };
  if (label) {
    // Calls to the font funcs are inlined here to avoid making the call if not actually required.
    if (axisOrientation === 'left' || axisOrientation === 'right') {
      result[axisOrientation] =
        labelAngle === 'horizontal'
          ? measureTextWithCache(label, bigFont) + labelPadding
          : getFontMetricsWithCache(bigFont).height + labelPadding;
    } else {
      result[axisOrientation] =
        labelAngle === 'horizontal'
          ? getFontMetricsWithCache(bigFont).height + labelPadding
          : measureTextWithCache(label, bigFont) + labelPadding;
    }
  }
  return result;
}

// Returns the required adjustments for the given axis data.
export function calculateMarginForAxis(params: MarginCalculationParams): Margin {
  const ticks = calculateTicksData(params);
  return addMargins([getTickLineMargin(params), getTickLabelsMargin(params, ticks), getLabelMargin(params)]);
}
