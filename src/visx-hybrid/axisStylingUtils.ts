import {
  defaultBigLabelsTextStyle,
  defaultHideTicks,
  defaultHideZero,
  defaultHorizontalAxisAutoMarginLabelPadding,
  defaultSmallLabelsTextStyle,
  defaultTickLabelAlignment,
  defaultTickLabelPadding,
  defaultTickLength,
  defaultVerticalAxisAutoMarginLabelPadding
} from './constants';
import { getDefaultAxisLabelAngle } from './getDefaultAxisLabelAngle';
import { AxisOrientation, AxisStyles, LabelAlignment, TextStyles, TickLabelAlignment } from './types';

export function getHideTicks(propsHideTicks: boolean | undefined) {
  return propsHideTicks ?? defaultHideTicks;
}

export function getHideZero(propsHideZero: boolean | undefined) {
  return propsHideZero ?? defaultHideZero;
}

export function getTickLength(propsTickLength: number | undefined, axisStyles: AxisStyles | undefined) {
  return propsTickLength ?? axisStyles?.tickLength ?? defaultTickLength;
}

export function getTickLabelPadding(
  propsTickLabelPadding: number | undefined,
  axisStyles: AxisStyles | undefined
) {
  return propsTickLabelPadding ?? axisStyles?.tickLabelPadding ?? defaultTickLabelPadding;
}

export function getTickLabelTextStyles(
  //   propsLabelStyles: TextStyles | undefined,
  axisStyles: AxisStyles | undefined,
  smallLabelsStyles: TextStyles | undefined
): TextStyles {
  return /* propsLabelStyles ?? */ axisStyles?.tickLabel ?? smallLabelsStyles ?? defaultSmallLabelsTextStyle;
}

export function getTickLabelAlignment(
  propsTickLabelAlignment: TickLabelAlignment | undefined,
  axisStyles: AxisStyles | undefined
) {
  return propsTickLabelAlignment ?? axisStyles?.tickLabelAlignment ?? defaultTickLabelAlignment;
}

export function getAxisLabelTextStyles(
  /* propsLabelStyles: TextStyles | undefined, */
  axisStyles: AxisStyles | undefined,
  bigLabelsStyles: TextStyles | undefined
) {
  return /* propsLabelStyles ?? */ axisStyles?.axisLabel ?? bigLabelsStyles ?? defaultBigLabelsTextStyle;
}

export function getAxisLabelAlignment(
  propsLabelAlignment: LabelAlignment | undefined,
  axisStyles: AxisStyles | undefined,
  axisOrientation: AxisOrientation
) {
  return propsLabelAlignment ?? axisStyles?.axisLabelAlignment ?? getDefaultAxisLabelAngle(axisOrientation);
}

export function getAutoMarginAxisLabelPadding(
  propsAutoMarginLabelPadding: number | undefined,
  axisOrientation: AxisOrientation
) {
  return propsAutoMarginLabelPadding ?? (axisOrientation === 'left' || axisOrientation === 'right')
    ? defaultVerticalAxisAutoMarginLabelPadding
    : defaultHorizontalAxisAutoMarginLabelPadding;
}
