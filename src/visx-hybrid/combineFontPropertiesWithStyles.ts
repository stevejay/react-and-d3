import type { CSSProperties } from 'react';

import type { FontProperties } from './types';

export function combineFontPropertiesWithStyles(
  font: string | FontProperties | undefined,
  style: CSSProperties | undefined
): CSSProperties | undefined {
  if (typeof font === 'string') {
    return { font, ...style };
  } else if (font) {
    return { ...font, ...style };
  } else {
    return style;
  }
}
