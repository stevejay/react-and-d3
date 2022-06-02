import { animated } from 'react-spring';
import { Group } from '@visx/group';
import { getTicks } from '@visx/scale';

import { useGridTransitions } from './animation';
import { defaultSpringConfig } from './constants';
import { GridComponentProps, GridScale } from './types';

export type AllGridRowsProps<Scale extends GridScale> = GridComponentProps<Scale>;
//&
//Omit<LineProps & Omit<SVGProps<SVGLineElement>, keyof LineProps>, keyof GridRowsProps<Scale>>;

// function getAxisDomainAsReactKey<Scale extends GridScale>(value: ScaleInput<Scale>): Key {
//   return value.toString();
// }

export function GridRows<Scale extends GridScale>({
  top = 0,
  left = 0,
  scale,
  dimension,
  stroke = '#eaf0f6',
  strokeWidth = 1,
  strokeDasharray,
  className,
  numTicks = 10,
  // lineStyle,
  offset,
  tickValues,
  animate = true,
  springConfig = defaultSpringConfig
}: // ...restProps
AllGridRowsProps<Scale>) {
  // const position = createGridGenerator(scale, offset);
  // const previousPositionRef = useRef<typeof position | null>(null);
  // useEffect(() => {
  //   previousPositionRef.current = position;
  // });
  const ticks = tickValues ?? getTicks(scale, numTicks);
  // const scaleIsBandScale = isBandScale(scale);

  // const tickTransitions = useTransition<ScaleInput<Scale>, { y: number; opacity: number }>(ticks, {
  //   initial: (tickValue) => ({ opacity: 1, y: position(tickValue) }),
  //   from: (tickValue) => {
  //     if (scaleIsBandScale) {
  //       return { opacity: 0, y: position(tickValue) };
  //     }
  //     const initialPosition = previousPositionRef.current ? previousPositionRef.current(tickValue) : null;
  //     return !isNil(initialPosition) && isFinite(initialPosition)
  //       ? { opacity: 0, y: initialPosition }
  //       : { opacity: 0, y: position(tickValue) };
  //   },
  //   enter: (tickValue) => ({ opacity: 1, y: position(tickValue) }),
  //   update: (tickValue) => ({ opacity: 1, y: position(tickValue) }),
  //   leave: (tickValue) => {
  //     if (scaleIsBandScale) {
  //       return { opacity: 0 };
  //     }
  //     const exitPosition = position(tickValue);
  //     return isFinite(exitPosition) ? { opacity: 0, y: exitPosition } : { opacity: 0, y: 0 }; // TODO y:0 might be wrong
  //   },
  //   config: springConfig,
  //   keys: getAxisDomainAsReactKey,
  //   immediate: !animate
  // });

  const transitions = useGridTransitions(scale, 'rows', ticks, springConfig, animate, offset);

  return (
    <Group className={`visx-grid-rows ${className ?? ''}`} top={top} left={left}>
      {transitions(({ opacity, y }) => (
        <animated.line
          x1={0}
          y1={y}
          x2={dimension}
          y2={y}
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
