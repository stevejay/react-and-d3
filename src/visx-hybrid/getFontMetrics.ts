import { mapFontPropertiesToFontString } from './mapFontPropertiesToFontString';
import { getContext } from './measurementCanvas';
import { supportsCanvas } from './supportsCanvas';
import type { FontMetrics, FontProperties } from './types';

// Get the total height of the font.
function getHeight(metrics: TextMetrics): number {
  return Math.ceil(Math.abs(metrics.fontBoundingBoxAscent) + Math.abs(metrics.fontBoundingBoxDescent));
}

// Get the height of the font from the baseline.
function getHeightFromBaseline(metrics: TextMetrics): number {
  return Math.ceil(Math.abs(metrics.fontBoundingBoxAscent));
}

const textToMeasure = 'My';

export function getFontMetrics(font: string | FontProperties): FontMetrics {
  const resolvedFont = typeof font === 'string' ? font : mapFontPropertiesToFontString(font);
  if (!resolvedFont) {
    throw new Error('Could not resolve font.');
  }

  if (!supportsCanvas()) {
    throw new Error("The current environment doesn't support the Canvas API.");
  }

  const context = getContext();
  context.font = resolvedFont;
  const metrics = context.measureText(textToMeasure);
  // TODO Handle fontBoundingBoxAscent or fontBoundingBoxDescent not being available.
  return {
    height: getHeight(metrics),
    heightFromBaseline: getHeightFromBaseline(metrics)
  };
}
