import { Children, Fragment, isValidElement, ReactNode } from 'react';

import { calculateAxisMargin } from './calculateAxisMargin';
import { calculateAxisOrientation } from './calculateAxisOrientation';
import { mergeMargins } from './mergeMargins';
import type { AxisScale, BasicAxisProps, Margin, SVGAxisComponent, XYChartTheme } from './types';

/**
 * Looks for children of the SVGXYChart that have component names that end in 'Axis'.
 * For each of these, it calculates a margin value, before then combining those margins
 * into the single returned margin.
 */
export function calculateAutoMarginFromChildren(params: {
  children: ReactNode;
  horizontal: boolean;
  independentScale: AxisScale;
  dependentScale: AxisScale;
  independentRangePadding: [number, number];
  dependentRangePadding: [number, number];
  theme: XYChartTheme;
}): Margin {
  const {
    children,
    horizontal,
    independentScale,
    dependentScale,
    independentRangePadding,
    dependentRangePadding,
    theme
  } = params;
  const marginList: Margin[] = [];

  Children.forEach(children, (element) => {
    if (isValidElement(element)) {
      if (element.type === Fragment) {
        // Support wrapping axes in React.Fragment.
        marginList.push(calculateAutoMarginFromChildren(params));
      } else if (typeof element.type !== 'string' && element.type.name.endsWith('Axis')) {
        const elementType = element.type as SVGAxisComponent;
        const props = element.props as BasicAxisProps;
        const axisOrientation = calculateAxisOrientation(horizontal, props.variable, props.position);
        const scale = props.variable === 'independent' ? independentScale : dependentScale;
        const rangePadding =
          props.variable === 'independent' ? independentRangePadding : dependentRangePadding;
        const calculateMargin = elementType.calculateMargin ?? calculateAxisMargin;
        const autoMargin = calculateMargin(axisOrientation, scale, rangePadding, theme, props);
        marginList.push(autoMargin);
      }
    }
  });

  return mergeMargins(marginList);
}
