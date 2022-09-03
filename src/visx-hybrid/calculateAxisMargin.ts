import { addMargins } from './addMargins';
import {
  getAutoMarginAxisLabelPadding,
  getAxisLabelAlignment,
  getAxisLabelTextStyles,
  getHideTicks,
  getHideZero,
  getTickLabelAlignment,
  getTickLabelPadding,
  getTickLabelTextStyles,
  getTickLength
} from './axisStylingUtils';
import { calculateTicksData } from './calculateTicksData';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { measureTextWithCache } from './measureTextWithCache';
import type { SVGAxisProps } from './SVGAxis';
import type {
  AxisOrientation,
  AxisScale,
  AxisScaleOutput,
  IXYChartTheme,
  LabelAlignment,
  Margin,
  TextStyles,
  TickDatum,
  TickLabelAlignment
} from './types';

function getTickLineMargin(axisOrientation: AxisOrientation, tickLength: number, hideTicks: boolean): Margin {
  const result: Margin = { left: 0, right: 0, top: 0, bottom: 0 };
  result[axisOrientation] = hideTicks ? 0 : tickLength;
  return result;
}

function getTickLabelsMargin(
  axisOrientation: AxisOrientation,
  rangePadding: [number, number],
  tickLabelPadding: number,
  tickLabelAlignment: TickLabelAlignment,
  textStyles: TextStyles,
  ticks: readonly TickDatum[]
): Margin {
  const font = textStyles.font ?? '';
  // Calculate the dimensions of each tick label:
  const widths = ticks.map((tick) => measureTextWithCache(tick.label, font));
  // Get the width of the longest tick label:
  const maxTickLabelWidth = Math.max(0, ...widths);
  // Get the height of the tick labels:
  const tickLabelHeight = getFontMetricsWithCache(font).height;

  if (tickLabelAlignment === 'angled') {
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
        top: halfHeight - rangePadding[1],
        bottom: width + halfHeight - rangePadding[0]
      };
    } else if (axisOrientation === 'right') {
      return {
        left: 0,
        right: width + halfHeight + tickLabelPadding,
        top: width + halfHeight - rangePadding[1],
        bottom: halfHeight - rangePadding[0]
      };
    } else if (axisOrientation === 'top') {
      return {
        left: halfHeight - rangePadding[0],
        right: width + halfHeight - rangePadding[1],
        top: width + halfHeight + tickLabelPadding,
        bottom: 0
      };
    } else {
      return {
        left: width + halfHeight - rangePadding[0],
        right: halfHeight - rangePadding[1],
        top: 0,
        bottom: width + halfHeight + tickLabelPadding
      };
    }
  } else if (axisOrientation === 'left' || axisOrientation === 'right') {
    let width = 0;
    let halfHeight = 0;
    if (tickLabelAlignment === 'horizontal') {
      width = maxTickLabelWidth + tickLabelPadding;
      halfHeight = Math.ceil(tickLabelHeight * 0.5);
    } else {
      width = tickLabelHeight + tickLabelPadding;
      halfHeight = Math.ceil(maxTickLabelWidth * 0.5);
    }
    return {
      left: axisOrientation === 'left' ? width : 0,
      right: axisOrientation === 'right' ? width : 0,
      top: halfHeight - rangePadding[1],
      bottom: halfHeight - rangePadding[0]
    };
  } else {
    let halfWidth = 0;
    let height = 0;
    if (tickLabelAlignment === 'horizontal') {
      height = tickLabelHeight + tickLabelPadding;
      halfWidth = Math.ceil(maxTickLabelWidth * 0.5);
    } else if (tickLabelAlignment === 'vertical') {
      height = maxTickLabelWidth + tickLabelPadding;
      halfWidth = Math.ceil(tickLabelHeight * 0.5);
    }
    return {
      left: halfWidth - rangePadding[0],
      right: halfWidth - rangePadding[1],
      top: axisOrientation === 'top' ? height : 0,
      bottom: axisOrientation === 'bottom' ? height : 0
    };
  }
}

// The dimensions consists of the label and the label padding.
function getLabelMargin(
  axisOrientation: AxisOrientation,
  label: string,
  labelPadding: number,
  labelAlignment: LabelAlignment,
  textStyles: TextStyles
): Margin {
  const font = textStyles.font ?? '';
  const result: Margin = { left: 0, right: 0, top: 0, bottom: 0 };
  if (label) {
    // Calls to the font funcs are inlined here to avoid making the call if not actually required.
    if (axisOrientation === 'left' || axisOrientation === 'right') {
      result[axisOrientation] =
        labelAlignment === 'horizontal'
          ? measureTextWithCache(label, font) + labelPadding
          : getFontMetricsWithCache(font).height + labelPadding;
    } else {
      result[axisOrientation] =
        labelAlignment === 'horizontal'
          ? getFontMetricsWithCache(font).height + labelPadding
          : measureTextWithCache(label, font) + labelPadding;
    }
  }
  return result;
}

/**
 * A function for calculating the margin for an axis. This function is correct
 * for calculating the margin for the `SVGAxis` component.
 */
export function calculateAxisMargin(
  axisOrientation: AxisOrientation,
  scale: AxisScale<AxisScaleOutput>,
  rangePadding: [number, number],
  theme: IXYChartTheme,
  props: SVGAxisProps
): Margin {
  const ticks = calculateTicksData({
    scale,
    hideZero: getHideZero(props.hideZero),
    tickFormat: props.tickFormat,
    tickCount: props.tickCount,
    tickValues: props.tickValues
  });
  const axisStyles = theme?.axis?.[axisOrientation];
  return addMargins([
    getTickLineMargin(
      axisOrientation,
      getTickLength(props.tickLength, axisStyles),
      getHideTicks(props.hideTicks)
    ),
    getTickLabelsMargin(
      axisOrientation,
      rangePadding,
      getTickLabelPadding(props.tickLabelPadding, axisStyles),
      getTickLabelAlignment(props.tickLabelAlignment, axisStyles),
      getTickLabelTextStyles(axisStyles, theme.smallLabels),
      ticks
    ),
    getLabelMargin(
      axisOrientation,
      props.label ?? '',
      getAutoMarginAxisLabelPadding(props.autoMarginLabelPadding, axisOrientation),
      getAxisLabelAlignment(props.labelAlignment, axisStyles, axisOrientation),
      getAxisLabelTextStyles(axisStyles, theme.bigLabels)
    )
  ]);
}
