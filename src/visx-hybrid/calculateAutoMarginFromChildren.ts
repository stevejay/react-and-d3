import { Children, Fragment, isValidElement, ReactNode } from 'react';

import { calculateAxisOrientation } from './calculateAxisOrientation';
import { mergeMargins } from './mergeMargins';
import type { AxisScale, IMarginComponent, IXYChartTheme, Margin } from './types';

/**
 * Looks for children of the SVGXYChart that have component names that end in 'Axis'.
 * For each of these, it calculates a margin value, before then combining those margins
 * into the single returned margin. If the axis component has a property on it called
 * `calculateMargin` then that function is invoked to calculate the margin for it,
 * otherwise the fallback `calculateAxisMargin` function is invoked.
 */
export function calculateAutoMarginFromChildren(params: {
  children: ReactNode;
  horizontal: boolean;
  independentScale: AxisScale;
  dependentScale: AxisScale;
  alternateDependentScale: AxisScale | null;
  independentRangePadding: [number, number];
  dependentRangePadding: [number, number];
  theme: IXYChartTheme;
}): Margin {
  const {
    children,
    horizontal,
    independentScale,
    dependentScale,
    alternateDependentScale,
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
      } else if (typeof element.type !== 'string' && (element.type as IMarginComponent)?.calculateMargin) {
        const props = element.props;
        const axisOrientation = calculateAxisOrientation(horizontal, props.variable, props.position);
        const scale =
          props.variable === 'independent'
            ? independentScale
            : props.variable === 'dependent'
            ? dependentScale
            : alternateDependentScale;
        if (!scale) {
          throw new Error(`Missing scale configuration for ${props.variable} scale.`);
        }
        const rangePadding =
          props.variable === 'independent' ? independentRangePadding : dependentRangePadding;
        const calculateMargin = (element.type as IMarginComponent).calculateMargin;
        const margin = calculateMargin(axisOrientation, scale, rangePadding, theme, props);
        marginList.push(margin);
      }
    }
  });

  return mergeMargins(marginList);
}
