import type { SVGProps } from 'react';
import { animated } from 'react-spring';

import { defaultShapeRendering } from './constants';
import { RenderAnimatedBarProps } from './types';

export type SVGBarProps<Datum extends object> = RenderAnimatedBarProps<Datum> &
  Omit<Omit<SVGProps<SVGPolygonElement>, 'points' | 'ref'>, keyof RenderAnimatedBarProps<Datum>>;
//  & {
//   barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps);
// };

export function SVGBar<Datum extends object>({
  springValues: { points, opacity },
  dataKey: _dataKey,
  datum: _datum,
  index: _index,
  horizontal: _horizontal,
  color,
  ...rest
}: // colorScale,
// colorAccessor,
// barProps
SVGBarProps<Datum>) {
  const { style, ...restBarProps } = rest;
  // const {
  //   style: barStyle,
  //   // fill,
  //   ...restBarProps
  // } = (typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps) ?? {};
  return (
    <>
      <animated.polygon
        data-testid="bar"
        points={points}
        fill={color}
        style={{ ...style, opacity }}
        shapeRendering={defaultShapeRendering}
        role="presentation"
        aria-hidden
        {...restBarProps}
        // {...eventEmitters}
      />
    </>
  );
}
