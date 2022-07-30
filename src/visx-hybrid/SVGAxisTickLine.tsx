import type { SVGProps } from 'react';

export type SVGAxisTickLineProps = Omit<SVGProps<SVGLineElement>, 'ref'>;

export function SVGAxisTickLine({
  stroke = 'currentColor',
  strokeLinecap = 'square',
  strokeWidth = 1,
  shapeRendering = 'crispEdges',
  ...rest
}: SVGAxisTickLineProps) {
  return (
    <line
      data-testid="axis-tick"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      shapeRendering={shapeRendering}
      role="presentation"
      aria-hidden
      {...rest}
    />
  );
}
