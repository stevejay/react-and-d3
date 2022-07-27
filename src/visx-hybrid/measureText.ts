import { isNil } from 'lodash-es';

export type Unpack<T> = T extends (infer U)[] ? U : T;

export type PlainObject<T = unknown> = Record<string, T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlainFunction<P = any, R = any> = (...args: P[]) => R;

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type SerializedTextMetrics = Mutable<TextMetrics>;

export type Font = FontProperties | Pick<CSSStyleDeclaration, 'font'> | string;

export interface FontProperties {
  /**
   * A list of one or more font family names.
   */
  fontFamily: string;

  /**
   * Set the size of the font.
   */
  fontSize: number;

  /**
   * Select a normal, condensed, or expanded face from the font.
   */
  fontStretch?: string;

  /**
   * Select a normal, italic, or oblique face from the font.
   */
  fontStyle?: string;

  /**
   * Select variants from the font.
   */
  fontVariant?: string;

  /**
   * Set the weight of the font.
   */
  fontWeight?: number | string;

  /**
   * Define how tall a line of text should be.
   */
  lineHeight?: number;
}

/**
 * Whether `HTMLCanvasElement` exists.
 */
export function supportsCanvas() {
  return typeof HTMLCanvasElement !== 'undefined';
}

/**
 * Serialize a `TextMetrics` object into a plain one.
 *
 * @param metrics - The `TextMetrics` object to serialize.
 */
export function serializeTextMetrics(metrics: TextMetrics) {
  const plainMetrics = {} as SerializedTextMetrics;

  for (const property of Object.getOwnPropertyNames(
    Object.getPrototypeOf(metrics)
  ) as (keyof TextMetrics)[]) {
    const value = metrics[property];

    if (typeof value === 'number') {
      plainMetrics[property] = value;
    }
  }

  return plainMetrics;
}

/**
 * Remove line breaks from a string.
 *
 * @param string - The string to normalize.
 */
export function normalizeString(string: string) {
  return string.replace(/\r?\n|\r/gm, '').trim();
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

/**
 * Create a `font` string from font properties.
 *
 * @param properties - The properties to create a `font` string from.
 * @param properties.fontFamily - A list of one or more font family names.
 * @param properties.fontSize - Set the size of the font.
 * @param [properties.fontStretch] - Select a normal, condensed, or expanded face from the font.
 * @param [properties.fontStyle] - Select a normal, italic, or oblique face from the font.
 * @param [properties.fontVariant] - Select variants from the font.
 * @param [properties.fontWeight] - Set the weight of the font.
 * @param [properties.lineHeight] - Define how tall a line of text should be.
 */
export function getFontProperties({
  fontFamily,
  fontSize,
  fontStretch,
  fontStyle,
  fontVariant,
  fontWeight,
  lineHeight
}: FontProperties) {
  if (!fontSize || !fontFamily) return;

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

/**
 * Create a `font` string from properties, an existing `font` string, or a `CSSStyleDeclaration`.
 *
 * @param [font] - The properties, `font` string, or `CSSStyleDeclaration` to generate a `font` string from.
 */
export function getFont(font?: Font) {
  if (font instanceof CSSStyleDeclaration) {
    return (font as CSSStyleDeclaration).getPropertyValue('font');
  } else if (typeof font === 'string') {
    return font;
  } else if (font) {
    return getFontProperties(font as FontProperties);
  } else {
    return undefined;
  }
}

let defaultFont: string;
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
    defaultFont = context.font;
  }

  return context;
}

/**
 * Measure text using an `OffscreenCanvas` or an `HTMLCanvasElement`.
 *
 * @param text - The text to measure.
 * @param [font] - The font properties to set.
 */
export function measureText(text: string, font?: Font): SerializedTextMetrics {
  const normalizedText = normalizeString(text);
  const resolvedFont = getFont(font);

  if (supportsCanvas()) {
    const context = getContext();
    context.font = resolvedFont ? resolvedFont : defaultFont;
    const metrics = context.measureText(normalizedText);

    return serializeTextMetrics(metrics);
  } else {
    throw new Error("The current environment doesn't seem to support the Canvas API.");
  }
}
