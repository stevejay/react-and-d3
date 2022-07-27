import { measureText as internalMeasureText, SerializedTextMetrics } from './measureText';

const textMetricsCache = new Map<string, SerializedTextMetrics>();

export function measureText(text: string, font: CSSStyleDeclaration): SerializedTextMetrics {
  const key = `${text}-${font.fontFamily}-${font.fontSize}-${font.fontWeight}`;
  let textMetrics = textMetricsCache.get(key);
  if (!textMetrics) {
    textMetrics = internalMeasureText(text, font);
    textMetricsCache.set(key, textMetrics);
  }
  return textMetrics;
}
