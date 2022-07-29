import { Children, Fragment, isValidElement, ReactNode } from 'react';

import { calculateAxisOrientation } from './calculateAxisOrientation';
import { calculateMarginForAxis } from './calculateMarginForAxis';
import { combineMargins } from './combineMargins';
import {
  defaultHideTicks,
  defaultHideZero,
  defaultLabelOffset,
  defaultLabelTextProps,
  defaultTickLabelPadding,
  defaultTickLabelTextProps,
  defaultTickLength
} from './constants';
import { getDefaultAxisLabelAngle } from './getDefaultAxisLabelAngle';
import type { AxisScale, Margin, XYChartTheme } from './types';

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
        element.props.variableType,
        element.props.position
      );
      const scale = element.props.variableType === 'independent' ? independentScale : dependentScale;
      const rangePadding =
        element.props.variableType === 'independent' ? independentRangePadding : dependentRangePadding;
      const autoMargin = calculateMarginForAxis({
        axisOrientation,
        scale,
        rangePadding,
        labelTextProps: theme?.svgLabelBig?.font ?? defaultLabelTextProps,
        tickLabelTextProps: theme?.svgLabelSmall?.font ?? defaultTickLabelTextProps,
        hideZero: element.props.hideZero ?? defaultHideZero,
        hideTicks: element.props.hideTicks ?? defaultHideTicks,
        label: element.props.label,
        tickFormat: element.props.tickFormat,
        tickCount: element.props.tickCount,
        tickValues: element.props.tickValues,
        tickLength: element.props.tickLength ?? defaultTickLength,
        tickLabelPadding: element.props.tickLabelPadding ?? defaultTickLabelPadding,
        labelPadding: element.props.labelPadding ?? defaultLabelOffset,
        tickLabelAngle: element.props.tickLabelAngle ?? 'horizontal',
        labelAngle: element.props.labelAngle ?? getDefaultAxisLabelAngle(axisOrientation)
      });
      marginList.push(autoMargin);
    }
  });

  return combineMargins(marginList);
}
