import type { SVGProps } from 'react';

export type SvgGroupProps = Omit<SVGProps<SVGGElement>, 'translate'> & {
  translateX: number;
  translateY: number;
};

export function SvgGroup({ translateX, translateY, children, ...rest }: SvgGroupProps) {
  return (
    <g {...rest} transform={`translate(${translateX}, ${translateY})`}>
      {children}
    </g>
  );
}
