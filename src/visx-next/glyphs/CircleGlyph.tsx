import { SVGProps } from 'react';
import { animated, SpringValue } from 'react-spring';

export type CircleGlyphProps = {
  size: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
  opacity: SpringValue<number>;
  fill?: string;
} & Omit<SVGProps<SVGCircleElement>, 'ref' | 'x' | 'y' | 'size' | 'opacity' | 'fill'>;

export function CircleGlyph({ x, y, size, opacity, fill, ...rest }: CircleGlyphProps) {
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
