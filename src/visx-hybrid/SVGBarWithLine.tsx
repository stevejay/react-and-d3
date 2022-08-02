import type { SVGProps } from 'react';
import { animated } from 'react-spring';

import { defaultShapeRendering } from './constants';
import { SVGSimpleBar } from './SVGSimpleBar';
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
  const { style: lineStyle, ...restLineProps } = (typeof lineProps === 'function'
    ? lineProps(datum, index, dataKey)
    : lineProps) ?? {
    stroke: 'white',
    strokeWidth: 2
  };
  return (
    <>
      <SVGSimpleBar {...props} />
      <animated.line
        x1={x1}
        y1={y1}
        x2={horizontal ? x1 : x2}
        y2={horizontal ? y2 : y1}
        style={{ ...lineStyle, opacity }}
        shapeRendering={defaultShapeRendering}
        stroke="currenColor"
        strokeWidth={1}
        strokeLinecap="butt"
        role="presentation"
        aria-hidden
        {...restLineProps}
      />
    </>
  );
}
