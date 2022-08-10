import type { SVGProps } from 'react';
import { animated } from 'react-spring';

import { defaultShapeRendering } from './constants';
import type { SVGGlyphProps } from './types';

type CircleProps = Omit<SVGProps<SVGCircleElement>, 'cx' | 'cy' | 'r' | 'ref'>;

export type SVGCircleGlyphProps<Datum extends object> = SVGGlyphProps<Datum> & {
  circleProps?: CircleProps | ((datum: Datum, index: number, dataKey: string) => CircleProps);
};

export function SVGCircleGlyph<Datum extends object>({
  springValues: { cx, cy, r, opacity },
  datum,
  index,
  dataKey,
  colorScale,
  colorAccessor,
  circleProps
}: SVGCircleGlyphProps<Datum>) {
  const {
    style: circleStyle,
    fill,
    ...restCircleProps
  } = (typeof circleProps === 'function' ? circleProps(datum, index, dataKey) : circleProps) ?? {};
  return (
    <animated.circle
      data-testid="glyph"
      cx={cx}
      cy={cy}
      r={r}
      fill={colorAccessor?.(datum, dataKey) ?? fill ?? colorScale(dataKey) ?? '#666'}
      style={{ ...circleStyle, opacity }}
      shapeRendering={defaultShapeRendering}
      role="presentation"
      aria-hidden
      {...restCircleProps}
      // {...eventEmitters}
    />
  );
}
