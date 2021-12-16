import type { FC, SVGProps } from 'react';

export type SvgProps = Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'xmlns' | 'width' | 'height'> & {
  width: number;
  height: number;
};

export const Svg: FC<SvgProps> = ({ width, height, children, ...rest }) => (
  <svg
    {...rest}
    viewBox={`0 0 ${width} ${height}`}
    xmlns="http://www.w3.org/2000/svg"
    style={{ shapeRendering: 'optimizeSpeed' }}
    width={width}
    height={height}
  >
    {children}
  </svg>
);
