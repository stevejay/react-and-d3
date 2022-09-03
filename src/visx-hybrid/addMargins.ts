import type { Margin } from './types';

/**
 * Returns a margin object that is formed by adding together the given margins.
 * If `marginList` is empty then an 'all zeros' margin is returned.
 */
export function addMargins(marginList: readonly Margin[]): Margin {
  return marginList.reduce(
    (total, margin) => {
      total.left += margin.left;
      total.right += margin.right;
      total.top += margin.top;
      total.bottom += margin.bottom;
      return total;
    },
    { left: 0, right: 0, top: 0, bottom: 0 }
  );
}
