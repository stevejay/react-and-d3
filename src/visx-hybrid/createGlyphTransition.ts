import { isNil } from 'lodash-es';

import type { DatumPosition, GlyphTransition } from './types';

export function createGlyphTransition(
  args: DatumPosition | null
): Omit<GlyphTransition, 'opacity' | 'size'> | null {
  if (isNil(args)) {
    return null;
  }
  const { pointX, pointY } = args;
  return { cx: pointX, cy: pointY };
}
