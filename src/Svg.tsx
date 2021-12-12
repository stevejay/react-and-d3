import { FC } from 'react';

type SvgProps = {
  width: number;
  height: number;
};

export const Svg: FC<SvgProps> = ({ width, height, children }) => (
  <svg
    viewBox={`0 0 ${width} ${height}`}
    xmlns="http://www.w3.org/2000/svg"
    className="bg-slate-200 font-sans"
    style={{ shapeRendering: 'optimizeSpeed' }}
    width={width}
    height={height}
  >
    {children}
  </svg>
);
