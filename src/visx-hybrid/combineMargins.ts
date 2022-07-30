import type { Margin } from './types';

export function combineMargins(marginList: Margin[]): Margin {
  return {
    left: Math.max(0, ...marginList.map((x) => x.left)) ?? 0,
    right: Math.max(0, ...marginList.map((x) => x.right)) ?? 0,
    top: Math.max(0, ...marginList.map((x) => x.top)) ?? 0,
    bottom: Math.max(0, ...marginList.map((x) => x.bottom)) ?? 0
  };
}
