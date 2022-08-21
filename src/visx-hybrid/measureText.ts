// Adapted from https://www.npmjs.com/package/typometer

import { isNil } from './isNil';
import { mapFontPropertiesToFontString } from './mapFontPropertiesToFontString';
import { supportsCanvas } from './supportsCanvas';
import { getContext } from './textMeasurementCanvas';
import type { FontProperties } from './types';

// Get the total width of the actual bounding box.
// From https://erikonarheim.com/posts/canvas-text-metrics/
function getWidth(metrics: TextMetrics): number {
  return isNil(metrics.actualBoundingBoxLeft) || isNil(metrics.actualBoundingBoxRight)
    ? Math.ceil(Math.abs(metrics.width))
    : Math.ceil(Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight));
}

export function measureText(text: string, font: string | FontProperties): number {
  const resolvedFont = typeof font === 'string' ? font : mapFontPropertiesToFontString(font);
  if (!resolvedFont) {
    throw new Error('Could not resolve font.');
  }

  if (!supportsCanvas()) {
    throw new Error("The current environment doesn't support the Canvas API.");
  }

  const context = getContext();
  context.font = resolvedFont;
  const metrics = context.measureText(text);
  return getWidth(metrics);
}
