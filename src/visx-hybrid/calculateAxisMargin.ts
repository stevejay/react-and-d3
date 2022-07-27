import { max } from 'lodash-es';

import {
  AxisScale,
  AxisScaleOutput,
  Margin,
  Orientation,
  ScaleInput,
  TickFormatter
} from '@/visx-next/types';

import { getTicksData } from './getTicksData';
import { measureText } from './textMetricsCache';

// function getTextMetrics(
//   label: string,
//   fontFamily: string,
//   fontSize: number,
//   fontWeight: number
// ): {
//   width: number;
// } {
//   return { width: 0 };
// }

// Returns the required adjustments for the given axis data.
export function calculateAxisMargin(
  orientation: Orientation,
  scale: AxisScale<AxisScaleOutput>,
  hideZero?: boolean,
  tickFormat?: TickFormatter<ScaleInput<AxisScale>>,
  tickCount?: number,
  tickValues?: ScaleInput<AxisScale>[],
  tickLength?: number,
  hideTicks?: boolean,
  tickLabelPadding?: number,
  label?: string,
  labelOffset?: number
): Margin {
  const tickLabelFontFamily = '"Readex Pro", sans-serif';
  const tickLabelFontSize = 12;
  const tickLabelFontWeight = 400;

  //   const labelFontFamily = '"Readex Pro", sans-serif';
  const labelFontSize = 14;
  //   const labelFontWeight = 400;

  const margin = { left: 0, top: 0, right: 0, bottom: 0 };

  const ticks = getTicksData(scale, hideZero, tickFormat, tickCount, tickValues);

  if (orientation === 'left' || orientation === 'right') {
    const labelWidth = label ? labelFontSize + (labelOffset ?? 0) : 0;
    const tickWidth = hideTicks ? 0 : (tickLength ?? 0) + (tickLabelPadding ?? 0);
    const maxTickLabelWidth =
      max(
        ticks
          .map(
            (tick) =>
              measureText(tick.label, {
                fontFamily: tickLabelFontFamily,
                fontSize: `${tickLabelFontSize}`,
                fontWeight: `${tickLabelFontWeight}`
              } as CSSStyleDeclaration)
            // getTextMetrics(tick.label, tickLabelFontFamily, tickLabelFontSize, tickLabelFontWeight)
          )
          .map((metrics) => metrics.width)
      ) ?? 0;
    // console.log(orientation, labelWidth, maxTickLabelWidth, tickWidth);
    if (orientation === 'left') {
      return {
        left: Math.ceil(labelWidth + tickWidth + maxTickLabelWidth),
        right: 0,
        top: Math.ceil(tickLabelFontSize * 0.5),
        bottom: Math.ceil(tickLabelFontSize * 0.5)
      };
    } else {
      return {
        right: Math.ceil(labelWidth + tickWidth + maxTickLabelWidth),
        left: 0,
        top: Math.ceil(tickLabelFontSize * 0.5),
        bottom: Math.ceil(tickLabelFontSize * 0.5)
      };
    }
  } else {
    // const labelWidth = getTextWidth(label, labelFontFamily, labelFontSize, labelFontWeight);
    const labelHeight = label ? labelFontSize + (labelOffset ?? 0) : 0;
    const tickHeight = hideTicks ? 0 : (tickLength ?? 0) + (tickLabelPadding ?? 0);
    const maxTickLabelWidth =
      max(
        ticks
          .map((tick) =>
            measureText(tick.label, {
              fontFamily: tickLabelFontFamily,
              fontSize: `${tickLabelFontSize}`,
              fontWeight: `${tickLabelFontWeight}`
            } as CSSStyleDeclaration)
          )
          .map((metrics) => metrics.width)
      ) ?? 0;
    // console.log(orientation, labelHeight, maxTickLabelWidth, tickHeight);
    if (orientation === 'top') {
      return {
        left: Math.ceil(maxTickLabelWidth * 0.5),
        right: Math.ceil(maxTickLabelWidth * 0.5),
        top: Math.ceil(labelHeight + tickHeight + tickLabelFontSize),
        bottom: 0
      };
    } else {
      return {
        left: Math.ceil(maxTickLabelWidth * 0.5),
        right: Math.ceil(maxTickLabelWidth * 0.5),
        top: 0,
        bottom: Math.ceil(labelHeight + tickHeight + tickLabelFontSize)
      };
    }
  }

  return margin;
}
