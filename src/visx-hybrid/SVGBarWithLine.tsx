import type { SVGProps } from 'react';
import { animated } from 'react-spring';

import { defaultShapeRendering } from './constants';
import { SVGBar } from './SVGBar';
import type { SVGBarProps } from './types';

type PolygonProps = Omit<SVGProps<SVGPolygonElement>, 'points' | 'ref'>;
type LineProps = Omit<SVGProps<SVGLineElement>, 'x1' | 'y1' | 'x2' | 'y2' | 'ref'>;

export type SVGBarWithLineProps<Datum extends object> = SVGBarProps<Datum> & {
  barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps);
  lineProps?: LineProps | ((datum: Datum, index: number, dataKey: string) => LineProps);
};

export function SVGBarWithLine<Datum extends object>(props: SVGBarWithLineProps<Datum>) {
  const {
    springValues: { opacity, x1, y1, x2, y2 },
    datum,
    index,
    dataKey,
    horizontal,
    lineProps
  } = props;
  const { style: lineStyle, ...restLineProps } =
    (typeof lineProps === 'function' ? lineProps(datum, index, dataKey) : lineProps) ?? {};
  return (
    <>
      <SVGBar {...props} />
      <animated.line
        x1={horizontal ? x2 : x1}
        y1={horizontal ? y1 : y2}
        x2={x2}
        y2={y2}
        style={{ ...lineStyle, opacity }}
        shapeRendering={defaultShapeRendering}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="butt"
        role="presentation"
        aria-hidden
        {...restLineProps}
      />
    </>
  );
}
