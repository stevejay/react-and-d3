import { SVGProps } from 'react';
import { animated } from 'react-spring';
import { Group } from '@visx/group';
import { getTicks } from '@visx/scale';
import { LineProps } from '@visx/shape/lib/shapes/Line';

import { useGridTransitions } from './animation';
import { defaultSpringConfig } from './constants';
import { GridComponentProps, GridScale } from './types';

export type AllGridColumnsProps<Scale extends GridScale> = GridComponentProps<Scale> &
  Omit<LineProps & Omit<SVGProps<SVGLineElement>, keyof LineProps>, keyof GridComponentProps<Scale>>;

export function GridColumns<Scale extends GridScale>({
  top = 0,
  left = 0,
  scale,
  dimension,
  stroke = '#eaf0f6',
  strokeWidth = 1,
  strokeDasharray,
  className,
  numTicks = 10,
  offset,
  tickValues,
  animate = true,
  springConfig = defaultSpringConfig
}: // ...restProps
AllGridColumnsProps<Scale>) {
  // const position = createGridGenerator(scale, offset);
  // const previousPositionRef = useRef<typeof position | null>(null);
  // useEffect(() => {
  //   previousPositionRef.current = position;
  // });
  const ticks = tickValues ?? getTicks(scale, numTicks);
  // const scaleIsBandScale = isBandScale(scale);

  // const tickTransitions = useTransition<ScaleInput<Scale>, { x: number; opacity: number }>(ticks, {
  //   initial: (tickValue) => ({ opacity: 1, x: position(tickValue) }),
  //   from: (tickValue) => {
  //     if (scaleIsBandScale) {
  //       return { opacity: 0, x: position(tickValue) };
  //     }
  //     const initialPosition = previousPositionRef.current ? previousPositionRef.current(tickValue) : null;
  //     return !isNil(initialPosition) && isFinite(initialPosition)
  //       ? { opacity: 0, x: initialPosition }
  //       : { opacity: 0, x: position(tickValue) };
  //   },
  //   enter: (tickValue) => ({ opacity: 1, x: position(tickValue) }),
  //   update: (tickValue) => ({ opacity: 1, x: position(tickValue) }),
  //   leave: (tickValue) => {
  //     if (scaleIsBandScale) {
  //       return { opacity: 0 };
  //     }
  //     const exitPosition = position(tickValue);
  //     return isFinite(exitPosition) ? { opacity: 0, x: exitPosition } : { opacity: 0, x: 0 }; // TODO x:0 might be wrong
  //   },
  //   config: springConfig,
  //   keys: getAxisDomainAsReactKey,
  //   immediate: !animate
  // });

  const transitions = useGridTransitions(scale, 'columns', ticks, springConfig, animate, offset);

  return (
    <Group className={`visx-grid-columns ${className ?? ''}`} top={top} left={left}>
      {transitions(({ opacity, x }) => (
        <animated.line
          x1={x}
          y1={0}
          x2={x}
          y2={dimension}
          style={{ opacity }}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          role="presentation"
        />
      ))}
    </Group>
  );
}
