import type { SVGProps } from 'react';

import { defaultShapeRendering } from './constants';
import type { LineStyles } from './types';

export type SVGAxisTickLineProps = { lineStyles?: LineStyles } & Omit<SVGProps<SVGLineElement>, 'ref'>;

export function SVGAxisTickLine({
  lineStyles,
  stroke,
  strokeLinecap,
  strokeWidth,
  strokeDasharray,
  className,
  style,
  ...rest
}: SVGAxisTickLineProps) {
  return (
    <line
      data-testid="axis-tick"
      role="presentation"
      aria-hidden
      style={{ ...lineStyles?.style, ...style }}
      className={`${lineStyles?.className ?? ''} ${className ?? ''}`}
      stroke={stroke ?? lineStyles?.stroke ?? 'currentColor'}
      strokeWidth={strokeWidth ?? lineStyles?.strokeWidth ?? 1}
      strokeLinecap={strokeLinecap ?? lineStyles?.strokeLinecap ?? 'square'}
      strokeDasharray={strokeDasharray ?? lineStyles?.strokeDasharray ?? undefined}
      shapeRendering={defaultShapeRendering}
      {...rest}
    />
  );
}
