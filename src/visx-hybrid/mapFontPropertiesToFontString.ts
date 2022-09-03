import type { FontProperties } from './types';

const DEFAULT_FONT_SIZE_UNIT = 'px';

/**
 * Merge a font size and an optional line height into a shorthand declaration.
 *
 * @param fontSize - The font size to merge.
 * @param lineHeight - The line height to merge.
 */
function getFontSizeWithLineHeight(fontSize: string | number, lineHeight?: string | number) {
  const fontSizeWithUnit = `${fontSize}${DEFAULT_FONT_SIZE_UNIT}`;
  return lineHeight ? `${fontSizeWithUnit}/${lineHeight}` : fontSizeWithUnit;
}

/** Create a `font` string from font properties. */
export function mapFontPropertiesToFontString({
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
