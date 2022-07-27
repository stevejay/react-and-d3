import { Children, Fragment, isValidElement, ReactNode } from 'react';
import { maxBy } from 'lodash-es';

import { AxisScale, Margin } from '@/visx-next/types';

import { calculateAxisMargin } from './calculateAxisMargin';
import { calculateOrientation } from './calculateOrientation';

export function getAutoMarginFromChildren(
  children: ReactNode,
  horizontal: boolean,
  independentScale: AxisScale,
  dependentScale: AxisScale
): Margin {
  const marginList: Margin[] = [];
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }

    if (element.type === Fragment) {
      // Transparently support React.Fragment and its children.
      marginList.push(
        getAutoMarginFromChildren(element.props.children, horizontal, independentScale, dependentScale)
      );
      return;
    }

    if (typeof element.type !== 'string' && element.type.name.endsWith('Axis')) {
      const orientation = calculateOrientation(
        horizontal,
        element.props.variableType,
        element.props.position
      );
      const scale = element.props.variableType === 'independent' ? independentScale : dependentScale;

      const autoMargin = calculateAxisMargin(
        orientation,
        scale,
        element.props.hideZero ?? false,
        element.props.tickFormat,
        element.props.tickCount,
        element.props.tickValues,
        element.props.tickLength ?? 8,
        element.props.hideTicks ?? false,
        element.props.tickLabelPadding ?? 6,
        element.props.label,
        element.props.labelOffset ?? 14
      );

      marginList.push(autoMargin);
    }
  });

  return combineMargins(marginList);
}

function combineMargins(marginList: Margin[]): Margin {
  return {
    left: Math.max(maxBy(marginList, 'left')?.left ?? 0, 0),
    right: Math.max(maxBy(marginList, 'right')?.right ?? 0, 0),
    top: Math.max(maxBy(marginList, 'top')?.top ?? 0, 0),
    bottom: Math.max(maxBy(marginList, 'bottom')?.bottom ?? 0, 0)
  };
}
