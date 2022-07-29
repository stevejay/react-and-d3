// Adapted from https://www.npmjs.com/package/typometer

import { isNil } from 'lodash-es';

import type { FontProperties, TextMeasurementResult } from './types';

function supportsCanvas() {
  return typeof HTMLCanvasElement !== 'undefined';
}

// Get the total width of the actual bounding box.
// From https://erikonarheim.com/posts/canvas-text-metrics/
function getWidth(metrics: TextMetrics): number {
  return Math.ceil(Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight));
}

// Get the total height of the font.
function getHeight(metrics: TextMetrics): number {
  return Math.ceil(Math.abs(metrics.fontBoundingBoxAscent) + Math.abs(metrics.fontBoundingBoxDescent));
}

// Get the height of the font from baseline.
function getHeightFromBaseline(metrics: TextMetrics): number {
  return Math.ceil(Math.abs(metrics.fontBoundingBoxAscent));
}

const normalizeStringRegExp = new RegExp(/\r?\n|\r/gm);

/**
 * Remove line breaks from a string and trims it.
 */
export function normalizeString(string: string) {
  return string.replace(normalizeStringRegExp, '').trim();
}

const DEFAULT_FONT_SIZE_UNIT = 'px';

/**
 * Merge a font size and an optional line height into a shorthand declaration.
 *
 * @param fontSize - The font size to merge.
 * @param lineHeight - The line height to merge.
 */
function getFontSizeWithLineHeight(fontSize: number, lineHeight?: number) {
  const fontSizeWithUnit = `${fontSize}${DEFAULT_FONT_SIZE_UNIT}`;
  return lineHeight ? `${fontSizeWithUnit}/${lineHeight}` : fontSizeWithUnit;
}

/** Create a `font` string from font properties. */
export function getFontProperties({
  fontFamily,
  fontSize,
  fontStretch,
  fontStyle,
  fontVariant,
  fontWeight,
  lineHeight
}: FontProperties): string | null {
  if (!fontSize || !fontFamily) {
    return null;
  }

  const font = [
    fontStyle,
    fontVariant,
    fontWeight,
    fontStretch,
    getFontSizeWithLineHeight(fontSize, lineHeight),
    fontFamily
  ].filter(Boolean);

  return font.join(' ');
}

let context: CanvasRenderingContext2D;

/**
 * Access a 2D rendering context by creating one if it doesn't exist yet.
 */
function getContext() {
  if (isNil(context)) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }
  return context;
}

/** Measure text using an `HTMLCanvasElement`. */
export function measureText(text: string, fontPropertiesStr: string): TextMeasurementResult {
  const normalizedText = normalizeString(text);
  // const resolvedFont = getFontProperties(font);

  if (supportsCanvas()) {
    const context = getContext();
    context.font = fontPropertiesStr;
    const metrics = context.measureText(normalizedText);
    return {
      width: getWidth(metrics),
      height: getHeight(metrics),
      heightFromBaseline: getHeightFromBaseline(metrics)
    };
  } else {
    throw new Error("The current environment doesn't support the Canvas API.");
  }
}
