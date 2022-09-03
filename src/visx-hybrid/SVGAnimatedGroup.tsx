import type { ReactNode, SVGProps } from 'react';
import { animated, SpringConfig, useSpring } from 'react-spring';

export type SVGAnimatedGroupProps = {
  x: number;
  y: number;
  springConfig?: SpringConfig;
  animate?: boolean;
  children: ReactNode;
} & Omit<SVGProps<SVGGElement>, 'ref' | 'x' | 'y'>;

export function SVGAnimatedGroup({
  x,
  y,
  springConfig,
  animate = true,
  children,
  style,
  ...restProps
}: SVGAnimatedGroupProps) {
  const styles = useSpring({ to: { x, y }, config: springConfig, immediate: !animate });
  return (
    <animated.g {...restProps} style={{ ...style, ...styles }}>
      {children}
    </animated.g>
  );
}
