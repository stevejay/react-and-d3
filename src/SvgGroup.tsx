import { FC, SVGProps } from 'react';

export type SvgGroupProps = Omit<SVGProps<SVGGElement>, 'translate'> & {
  translateX: number;
  translateY: number;
};

export const SvgGroup: FC<SvgGroupProps> = ({ translateX, translateY, children, ...rest }) => (
  <g {...rest} transform={`translate(${translateX}, ${translateY})`}>
    {children}
  </g>
);
