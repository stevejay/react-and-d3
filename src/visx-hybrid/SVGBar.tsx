import type { SVGProps } from 'react';
import { animated } from 'react-spring';

import { defaultShapeRendering } from './constants';
import { RenderAnimatedBarProps } from './types';

export type SVGBarProps<Datum extends object> = RenderAnimatedBarProps<Datum> &
  Omit<Omit<SVGProps<SVGPolygonElement>, 'points' | 'ref'>, keyof RenderAnimatedBarProps<Datum>>;

export function SVGBar<Datum extends object>({
  springValues: { points, opacity },
  dataKey: _dataKey,
  datum: _datum,
  index: _index,
  horizontal: _horizontal,
  color,
  ...rest
}: SVGBarProps<Datum>) {
  const { style, ...restBarProps } = rest;
  return (
    <animated.polygon
      data-testid="bar"
      points={points}
      fill={color}
      style={{ ...style, opacity }}
      shapeRendering={defaultShapeRendering}
      role="presentation"
      aria-hidden
      {...restBarProps}
    />
  );
}
