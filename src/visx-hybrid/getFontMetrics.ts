import { getFallbackTextMetrics } from './getFallbackTextMetrics';
import { isDefined } from './isDefined';
import { supportsCanvas } from './supportsCanvas';
import { getContext } from './textMeasurementCanvas';
import type { FontMetrics } from './types';

// Detects if the `TextMetrics` object has the required extended text metrics properties.
function hasRequiredTextMetrics(textMetrics: TextMetrics): boolean {
  return isDefined(textMetrics.fontBoundingBoxAscent) && isDefined(textMetrics.fontBoundingBoxDescent);
}

// Get the total height of the font.
function getHeight(textMetrics: TextMetrics): number {
  return Math.ceil(
    Math.abs(textMetrics.fontBoundingBoxAscent) + Math.abs(textMetrics.fontBoundingBoxDescent)
  );
}

// Get the height of the font from the baseline.
function getHeightFromBaseline(textMetrics: TextMetrics): number {
  return Math.ceil(Math.abs(textMetrics.fontBoundingBoxAscent));
}

const metricsString = '|ÉqÅM';

export function getFontMetrics(font: string): FontMetrics {
  if (!supportsCanvas()) {
    throw new Error("The current environment doesn't support the Canvas API.");
  }
  const context = getContext();
  context.font = font;
  let textMetrics = context.measureText(metricsString);
  if (!hasRequiredTextMetrics(textMetrics)) {
    textMetrics = getFallbackTextMetrics(font);
  }
  return {
    height: getHeight(textMetrics),
    heightFromBaseline: getHeightFromBaseline(textMetrics)
  };
}
