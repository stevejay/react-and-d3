import type { Margin } from './types';

/** Returns a margin object that is formed from the maximum value for each margin direction in the given list of margin objects. If `marginList` is empty then a minimum value margin is returned. */
export function mergeMargins(marginList: Margin[], minMarginValue = 1): Margin {
  return {
    left: Math.max(minMarginValue, ...marginList.map((x) => x.left)) ?? minMarginValue,
    right: Math.max(minMarginValue, ...marginList.map((x) => x.right)) ?? minMarginValue,
    top: Math.max(minMarginValue, ...marginList.map((x) => x.top)) ?? minMarginValue,
    bottom: Math.max(minMarginValue, ...marginList.map((x) => x.bottom)) ?? minMarginValue
  };
}
