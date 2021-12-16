import { forwardRef, SVGProps } from 'react';

export type SvgProps = Omit<SVGProps<SVGSVGElement>, 'xmlns' | 'width' | 'height' | 'style'> & {
  width: number;
  height: number;
};

export const Svg = forwardRef<SVGSVGElement, SvgProps>(
  ({ width, height, viewBox, children, ...rest }, ref) => (
    <svg
      {...rest}
      ref={ref}
      viewBox={viewBox || `0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ shapeRendering: 'optimizeSpeed' }}
      width={width}
      height={height}
    >
      {children}
    </svg>
  )
);
