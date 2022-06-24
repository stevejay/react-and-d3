import { SVGProps } from 'react';
import { animated, SpringValue } from 'react-spring';

export type CircleGlyphProps<Datum extends object> = {
  size: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
  opacity: SpringValue<number>;
  fill?: string;
  datum?: Datum;
} & Omit<SVGProps<SVGCircleElement>, 'ref' | 'x' | 'y' | 'size' | 'opacity' | 'fill'>;

export function CircleGlyph<Datum extends object>({
  x,
  y,
  size,
  opacity,
  fill,
  datum,
  ...rest
}: CircleGlyphProps<Datum>) {
  // const { style, ...restGlyphProps } =
  // typeof glyphProps === 'function' ? glyphProps(datum, index, dataKey) : glyphProps;
  return (
    <animated.circle
      {...rest}
      data-test-id="glyph"
      cx={x}
      cy={y}
      r={size}
      //   fill={fill ?? restGlyphProps.fill}
      fill={fill}
      //   style={{ ...style, opacity }}
      style={{ opacity }}
      //   {...restGlyphProps}
    />
  );
}
