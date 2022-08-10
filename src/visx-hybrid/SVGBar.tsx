import type { SVGProps } from 'react';
import { animated } from 'react-spring';

import { defaultShapeRendering } from './constants';
import type { SVGBarProps } from './types';

type PolygonProps = Omit<SVGProps<SVGPolygonElement>, 'points' | 'ref'>;

export type SVGSimpleBarProps<Datum extends object> = SVGBarProps<Datum> & {
  barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps);
};

export function SVGBar<Datum extends object>({
  springValues: { points, opacity },
  datum,
  index,
  dataKey,
  colorScale,
  colorAccessor,
  barProps
}: SVGSimpleBarProps<Datum>) {
  const {
    style: barStyle,
    fill,
    ...restBarProps
  } = (typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps) ?? {};
  return (
    <>
      <animated.polygon
        data-testid="bar"
        points={points}
        fill={colorAccessor?.(datum, dataKey) ?? fill ?? colorScale(dataKey) ?? '#666'}
        style={{ ...barStyle, opacity }}
        shapeRendering={defaultShapeRendering}
        role="presentation"
        aria-hidden
        {...restBarProps}
        // {...eventEmitters}
      />
    </>
  );
}
