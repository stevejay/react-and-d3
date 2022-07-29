import { maxBy } from 'lodash-es';

import type { Margin } from './types';

export function combineMargins(marginList: Margin[]): Margin {
  return {
    left: Math.max(maxBy(marginList, 'left')?.left ?? 0, 0),
    right: Math.max(maxBy(marginList, 'right')?.right ?? 0, 0),
    top: Math.max(maxBy(marginList, 'top')?.top ?? 0, 0),
    bottom: Math.max(maxBy(marginList, 'bottom')?.bottom ?? 0, 0)
  };
}
