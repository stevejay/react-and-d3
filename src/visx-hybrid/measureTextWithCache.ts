import { getFontProperties, measureText, normalizeString } from './measureText';
import type { FontProperties, TextMeasurementResult } from './types';

const textMetricsCache = new Map<string, TextMeasurementResult>();

// TODO: Think about making this an LRU cache (https://yomguithereal.github.io/mnemonist/lru-cache).

export function measureTextWithCache(text: string, font: FontProperties | string): TextMeasurementResult {
  const normalizedText = normalizeString(text);

  const resolvedFont = typeof font === 'string' ? font : getFontProperties(font);
  if (!resolvedFont) {
    throw new Error('Could not resolve font.');
  }

  const key = `${normalizedText}-${resolvedFont}`;
  let textMetrics = textMetricsCache.get(key);
  if (!textMetrics) {
    textMetrics = measureText(normalizedText, resolvedFont);
    textMetricsCache.set(key, textMetrics);
  }
  return textMetrics;
}
