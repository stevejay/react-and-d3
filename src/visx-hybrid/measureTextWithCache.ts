// Adapted from https://www.npmjs.com/package/typometer

import { isNil } from './isNil';
import { mapFontPropertiesToFontString } from './mapFontPropertiesToFontString';
import { measureText } from './measureText';
import type { FontProperties } from './types';

// TODO: Think about making this an LRU cache (https://yomguithereal.github.io/mnemonist/lru-cache).
const cache = new Map<string, number>();

const normalizeStringRegExp = new RegExp(/\r?\n|\r/gm);

/**
 * Remove line breaks from a string and trims it.
 */
function normalizeString(string: string) {
  return string.replace(normalizeStringRegExp, '').trim();
}

export function measureTextWithCache(text: string, font: FontProperties | string): number {
  const resolvedFont = typeof font === 'string' ? font : mapFontPropertiesToFontString(font);
  if (isNil(resolvedFont)) {
    throw new Error('Could not resolve font.');
  }

  const key = `${text}-${resolvedFont}`;
  let width = cache.get(key);
  if (isNil(width)) {
    const normalizedText = normalizeString(text);
    width = measureText(normalizedText, resolvedFont);
    cache.set(key, width);
  }

  return width;
}
