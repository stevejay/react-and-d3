import type { SVGProps } from 'react';
import { animated } from 'react-spring';

import { defaultShapeRendering } from './constants';
import type { RenderAnimatedGlyphProps } from './types';

type CircleProps = Omit<SVGProps<SVGCircleElement>, 'cx' | 'cy' | 'r' | 'ref'>;

export type SVGCircleGlyphProps<Datum extends object> = RenderAnimatedGlyphProps<Datum> &
  Omit<CircleProps, keyof RenderAnimatedGlyphProps<Datum>>;
//  & {
//   circleProps?: CircleProps | ((datum: Datum, index: number, dataKey: string) => CircleProps);
// };

export function SVGCircleGlyph<Datum extends object>({
  springValues: { cx, cy, size, opacity },
  dataKey: _dataKey,
  datum: _datum,
  index: _index,
  horizontal: _horizontal,
  color,
  ...rest
}: // circleProps
SVGCircleGlyphProps<Datum>) {
  const { style, ...restCircleProps } = rest;
  return (
    <animated.circle
      data-testid="circle-glyph"
      cx={cx}
      cy={cy}
      r={size}
      fill={color}
      style={{ ...style, opacity }}
      shapeRendering={defaultShapeRendering}
      role="presentation"
      aria-hidden
      {...restCircleProps}
      // {...eventEmitters}
    />
  );
}
