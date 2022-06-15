import { useContext } from 'react';
import { animated } from 'react-spring';
import { Group } from '@visx/group';
import { getTicks } from '@visx/scale';
import { isNil } from 'lodash-es';

import { useAxisTransitions } from './animation';
import { defaultSpringConfig } from './constants';
import { DataContext } from './DataContext';
import { CommonGridProps, GridScale } from './types';

export type ColumnGridProps<Scale extends GridScale> = CommonGridProps<Scale> & {
  top: number;
  height: number;
};

export function ColumnGrid<Scale extends GridScale>({
  scale,
  springConfig = defaultSpringConfig,
  tickValues,
  animate = true,
  tickCount = 10,
  offset,
  top,
  height,
  groupProps,
  stroke = 'currentColor',
  strokeWidth = 1,
  strokeLinecap = 'square',
  ...rest
}: ColumnGridProps<Scale>) {
  const ticks = tickValues ?? getTicks(scale, tickCount);
  const transitions = useAxisTransitions(scale, ticks, springConfig, animate, offset);
  const { className: groupClassName = '', ...restGroupProps } = groupProps ?? {};
  return (
    <Group {...restGroupProps} className={`column-grid ${groupClassName}`} top={top} left={0}>
      {transitions(({ opacity, translate }) => (
        <animated.line
          x1={translate}
          y1={0}
          x2={translate}
          y2={height}
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

export type XYChartColumnGridProps<Scale extends GridScale> = Omit<
  ColumnGridProps<Scale>,
  'scale' | 'top' | 'height'
>;

export function XYChartColumnGrid<Scale extends GridScale>(props: XYChartColumnGridProps<Scale>) {
  const { xScale, margin, innerHeight, springConfig: fallbackSpringConfig } = useContext(DataContext);
  if (!xScale || isNil(innerHeight)) {
    return null;
  }
  return (
    <ColumnGrid
      {...props}
      top={margin?.top ?? 0}
      scale={xScale}
      height={innerHeight}
      springConfig={props.springConfig ?? fallbackSpringConfig}
    />
  );
}
