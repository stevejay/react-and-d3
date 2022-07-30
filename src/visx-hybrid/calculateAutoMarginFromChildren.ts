import { Children, Fragment, isValidElement, ReactNode } from 'react';

import { calculateAxisOrientation } from './calculateAxisOrientation';
import { calculateMarginForAxis } from './calculateMarginForAxis';
import { combineMargins } from './combineMargins';
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
import type { AxisScale, Margin, XYChartTheme } from './types';

// const extraPaddingPx = 1;

/**
 * Looks for children of the SVGXYChart that have component names that end in 'Axis'.
 * For each of these, it calculates its margin values, before then combining all
 * of the created margins and returning that single margin result.
 */
export function calculateAutoMarginFromChildren(
  children: ReactNode,
  horizontal: boolean,
  independentScale: AxisScale,
  dependentScale: AxisScale,
  independentRangePadding: number,
  dependentRangePadding: number,
  theme: XYChartTheme
): Margin {
  // For accumulating the margins. They get collapsed into a single margin result.
  const marginList: Margin[] = [];

  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    } else if (element.type === Fragment) {
      // Transparently support React.Fragment and its children.
      marginList.push(
        calculateAutoMarginFromChildren(
          element.props.children,
          horizontal,
          independentScale,
          dependentScale,
          independentRangePadding,
          dependentRangePadding,
          theme
        )
      );
    } else if (typeof element.type !== 'string' && element.type.name.endsWith('Axis')) {
      const axisOrientation = calculateAxisOrientation(
        horizontal,
        element.props.variable,
        element.props.position
      );
      const scale = element.props.variable === 'independent' ? independentScale : dependentScale;
      const rangePadding =
        element.props.variable === 'independent' ? independentRangePadding : dependentRangePadding;
      const autoMargin = calculateMarginForAxis({
        axisOrientation,
        scale,
        rangePadding,
        bigFont: theme?.bigLabels?.font ?? defaultBigLabelsTextStyle.font,
        smallFont: theme?.smallLabels?.font ?? defaultSmallLabelsTextStyle.font,
        hideZero: element.props.hideZero ?? defaultHideZero,
        hideTicks: element.props.hideTicks ?? defaultHideTicks,
        label: element.props.label,
        tickFormat: element.props.tickFormat,
        tickCount: element.props.tickCount,
        tickValues: element.props.tickValues,
        tickLength: element.props.tickLength ?? defaultTickLength,
        tickLabelPadding: element.props.tickLabelPadding ?? defaultTickLabelPadding,
        labelPadding: element.props.autoMarginLabelPadding ?? defaultAutoMarginLabelPadding,
        tickLabelAngle: element.props.tickLabelAngle ?? defaultTickLabelAngle,
        labelAngle: element.props.labelAngle ?? getDefaultAxisLabelAngle(axisOrientation)
      });
      marginList.push(autoMargin);
    }
  });

  return combineMargins(marginList);

  // const combinedMargin = combineMargins(marginList);
  // return {
  //   left: combinedMargin.left + extraPaddingPx,
  //   right: combinedMargin.right + extraPaddingPx,
  //   top: combinedMargin.top + extraPaddingPx,
  //   bottom: combinedMargin.bottom + extraPaddingPx
  // };
}
