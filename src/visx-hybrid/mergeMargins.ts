import type { Margin } from './types';

/** Returns a margin object that is formed from the maximum value for each margin direction in the given list of margin objects. */
export function mergeMargins(marginList: Margin[]): Margin {
  return {
    left: Math.max(0, ...marginList.map((x) => x.left)) ?? 0,
    right: Math.max(0, ...marginList.map((x) => x.right)) ?? 0,
    top: Math.max(0, ...marginList.map((x) => x.top)) ?? 0,
    bottom: Math.max(0, ...marginList.map((x) => x.bottom)) ?? 0
  };
}
