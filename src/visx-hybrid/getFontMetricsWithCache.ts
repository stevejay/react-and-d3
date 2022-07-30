import { isNil } from 'lodash-es';

import { getFontMetrics } from './getFontMetrics';
import { mapFontPropertiesToFontString } from './mapFontPropertiesToFontString';
import type { FontMetrics, FontProperties } from './types';

const cache = new Map<string, FontMetrics>();

export function getFontMetricsWithCache(font: string | FontProperties): FontMetrics {
  const resolvedFont = typeof font === 'string' ? font : mapFontPropertiesToFontString(font);
  if (isNil(resolvedFont)) {
    throw new Error('Could not resolve font.');
  }

  const key = resolvedFont;
  let fontMetrics = cache.get(key);
  if (isNil(fontMetrics)) {
    fontMetrics = getFontMetrics(resolvedFont);
    cache.set(key, fontMetrics);
  }

  return fontMetrics;
}
