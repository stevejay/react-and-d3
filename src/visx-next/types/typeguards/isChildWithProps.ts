import { Children, ReactElement, ReactNode } from 'react';

/** Returns whether the React.ReactNode has props (and therefore is an `Element` versus primitive type) */
export function isChildWithProps<P extends object>(child: ReactNode): child is ReactNode {
  // TODO Fix
  return !!child && typeof child === 'object' && 'props' in child && child.props != null;
}

/**
 * Returns children and grandchildren of type React.ReactNode.
 * Flattens children one level to support React.Fragments and Array type children.
 */
export function getChildrenAndGrandchildrenWithProps<P extends object>(
  children: ReactNode
): ReactElement<P>[] {
  return Children.toArray(children)
    .flatMap((child) => {
      if (typeof child === 'object' && 'props' in child && child.props.children) {
        return child.props.children;
      }
      return child;
    })
    .filter((child) => isChildWithProps<P>(child));
}
