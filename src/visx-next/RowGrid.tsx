import { useContext } from 'react';
import { animated } from 'react-spring';
import { Group } from '@visx/group';
import { getTicks } from '@visx/scale';
import { isNil } from 'lodash-es';

import { useAxisTransitions } from './animation';
import { defaultSpringConfig } from './constants';
import { DataContext } from './DataContext';
import { CommonGridProps, GridScale } from './types';

export type RowGridProps<Scale extends GridScale> = CommonGridProps<Scale> & {
  left: number;
  width: number;
};

export function RowGrid<Scale extends GridScale>({
  scale,
  springConfig = defaultSpringConfig,
  tickValues,
  animate = true,
  tickCount = 10,
  offset,
  left,
  width,
  groupProps,
  stroke = 'currentColor',
  strokeWidth = 1,
  strokeLinecap = 'square',
  ...rest
}: RowGridProps<Scale>) {
  const ticks = tickValues ?? getTicks(scale, tickCount);
  const transitions = useAxisTransitions(scale, ticks, springConfig, animate, offset);
  const { className: groupClassName = '', ...restGroupProps } = groupProps ?? {};
  return (
    <Group {...restGroupProps} className={`row-grid ${groupClassName}`} top={0} left={left}>
      {transitions(({ opacity, translate }) => (
        <animated.line
          x1={0}
          y1={translate}
          x2={width}
          y2={translate}
          style={{ opacity }}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          role="presentation"
          aria-hidden
          {...rest}
        />
      ))}
    </Group>
  );
}

export type XYChartRowGridProps<Scale extends GridScale> = Omit<
  RowGridProps<Scale>,
  'left' | 'scale' | 'width'
>;

export function XYChartRowGrid<Scale extends GridScale>({
  springConfig,
  ...rest
}: XYChartRowGridProps<Scale>) {
  const { yScale, margin, innerWidth, springConfig: fallbackSpringConfig } = useContext(DataContext);
  if (!yScale || isNil(innerWidth)) {
    return null;
  }
  return (
    <RowGrid
      left={margin?.left ?? 0}
      scale={yScale}
      width={innerWidth}
      springConfig={springConfig ?? fallbackSpringConfig}
      {...rest}
    />
  );
}
