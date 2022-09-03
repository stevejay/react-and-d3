import { Children, ReactElement, ReactNode } from 'react';

import { isNil } from './isNil';

/** Returns whether the React.ReactNode has props (and therefore is an `Element` versus primitive type) */
function isChildWithProps(child: ReactNode): child is ReactNode {
  return !!child && typeof child === 'object' && 'props' in child && !isNil(child.props);
}

/**
 * Returns children and grandchildren of type React.ReactNode.
 * Flattens children one level to support React.Fragments and Array type children.
 */
export function getChildrenAndGrandchildrenWithProps<Props extends object>(
  children: ReactNode
): ReactElement<Props>[] {
  return Children.toArray(children)
    .flatMap((child) => {
      if (typeof child === 'object' && 'props' in child && child.props.children) {
        return child.props.children;
      }
      return child;
    })
    .filter((child) => isChildWithProps(child));
}
