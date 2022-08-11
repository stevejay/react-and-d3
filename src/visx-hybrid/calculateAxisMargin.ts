import { addMargins } from './addMargins';
import { calculateTicksData } from './calculateTicksData';
import {
  defaultAutoMarginLabelPadding,
  defaultBigLabelsTextStyle,
  defaultHideTicks,
  defaultHideZero,
  defaultSmallLabelsTextStyle,
  defaultTickLabelAngle,
  defaultTickLabelPadding,
  defaultTickLength
} from './constants';
import { getDefaultAxisLabelAngle } from './getDefaultAxisLabelAngle';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { measureTextWithCache } from './measureTextWithCache';
import type { SVGAxisProps } from './SVGAxis';
import type {
  AxisOrientation,
  AxisScale,
  AxisScaleOutput,
  FontProperties,
  LabelAlignment,
  Margin,
  TickDatum,
  TickLabelAlignment,
  XYChartTheme
} from './types';

function getTickLineMargin(axisOrientation: AxisOrientation, tickLength: number, hideTicks: boolean): Margin {
  const result: Margin = { left: 0, right: 0, top: 0, bottom: 0 };
  result[axisOrientation] = hideTicks ? 0 : tickLength;
  return result;
}

function getTickLabelsMargin(
  axisOrientation: AxisOrientation,
  rangePadding: number,
  tickLabelPadding: number,
  tickLabelAlignment: TickLabelAlignment,
  font: string | FontProperties,
  ticks: readonly TickDatum[]
): Margin {
  // Calculate the dimensions of each tick label:
  const widths = ticks.map((tick) => measureTextWithCache(tick.label, font));
  // Get the width of the longest tick label:
  const maxTickLabelWidth = Math.max(0, ...widths);
  // Get the height of the tick labels:
  const tickLabelHeight = getFontMetricsWithCache(font).height;

  if (axisOrientation === 'left' || axisOrientation === 'right') {
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
        top: halfHeight - rangePadding,
        bottom: halfHeight - rangePadding
      };
    }
  } else {
    // 'top' or 'bottom'.
    if (tickLabelAlignment === 'angled') {
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
      if (tickLabelAlignment === 'horizontal') {
        halfWidth = Math.ceil(maxTickLabelWidth * 0.5);
        height = tickLabelHeight + tickLabelPadding;
      } else if (tickLabelAlignment === 'vertical') {
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
function getLabelMargin(
  axisOrientation: AxisOrientation,
  label: string,
  labelPadding: number,
  labelAlignment: LabelAlignment,
  font: string | FontProperties
): Margin {
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

// Returns the required adjustments for the SVGAxis component.
export function calculateAxisMargin(
  axisOrientation: AxisOrientation,
  scale: AxisScale<AxisScaleOutput>,
  rangePadding: number,
  theme: XYChartTheme,
  props: SVGAxisProps
): Margin {
  const ticks = calculateTicksData({
    scale,
    hideZero: props.hideZero ?? defaultHideZero,
    tickFormat: props.tickFormat,
    tickCount: props.tickCount,
    tickValues: props.tickValues
  });
  return addMargins([
    getTickLineMargin(
      axisOrientation,
      props.tickLength ?? defaultTickLength,
      props.hideTicks ?? defaultHideTicks
    ),
    getTickLabelsMargin(
      axisOrientation,
      rangePadding,
      props.tickLabelPadding ?? defaultTickLabelPadding,
      props.tickLabelAlignment ?? defaultTickLabelAngle,
      theme.smallLabels?.font ?? defaultSmallLabelsTextStyle.font,
      ticks
    ),
    getLabelMargin(
      axisOrientation,
      props.label ?? '',
      props.autoMarginLabelPadding ?? defaultAutoMarginLabelPadding,
      props.labelAlignment ?? getDefaultAxisLabelAngle(axisOrientation),
      theme.bigLabels?.font ?? defaultBigLabelsTextStyle.font
    )
  ]);
}
