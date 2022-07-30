import { animated, SpringConfig } from 'react-spring';
import { Group } from '@visx/group';

import { Variable } from '@/visx-hybrid/types';
import { AxisScale, Margin } from '@/visx-next/types';

import { getTicksData } from './getTicksData';
import { GridConfig } from './types';
import { useAxisTransitions } from './useAxisTransitions';

export type SVGGridProps<Scale extends AxisScale> = {
  scale: Scale;
  gridConfig: GridConfig;
  horizontal: boolean;
  variable: Variable;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  springConfig: SpringConfig;
  animate: boolean;
  renderingOffset?: number;
};

export function SVGGrid<Scale extends AxisScale>({
  scale,
  gridConfig,
  horizontal,
  variable,
  innerWidth,
  innerHeight,
  margin,
  springConfig,
  animate,
  renderingOffset = 0
}: SVGGridProps<Scale>) {
  const gridType =
    variable === 'independent' ? (horizontal ? 'row' : 'column') : horizontal ? 'column' : 'row';

  const left =
    variable === 'independent' ? (horizontal ? margin?.left ?? 0 : 0) : horizontal ? 0 : margin?.left ?? 0;
  const top =
    variable === 'independent' ? (horizontal ? 0 : margin?.top ?? 0) : horizontal ? margin?.top ?? 0 : 0;
  const width = variable === 'independent' ? (horizontal ? innerWidth : 0) : horizontal ? 0 : innerWidth;
  const height = variable === 'independent' ? (horizontal ? 0 : innerHeight) : horizontal ? innerHeight : 0;

  const axisTicks = getTicksData(scale, gridConfig);
  const transitions = useAxisTransitions(scale, axisTicks, springConfig, animate, renderingOffset);
  const { className: groupClassName = '', ...restGroupProps } = gridConfig.groupProps ?? {};
  return (
    <Group {...restGroupProps} className={`row-grid ${groupClassName}`} top={top} left={left}>
      {transitions(({ opacity, translate }) => (
        <animated.line
          x1={gridType === 'row' ? 0 : translate}
          y1={gridType === 'row' ? translate : 0}
          x2={gridType === 'row' ? width : translate}
          y2={gridType === 'row' ? translate : height}
          style={{ opacity }}
          role="presentation"
          aria-hidden
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="square"
          {...gridConfig.tickLineProps}
        />
      ))}
    </Group>
  );
}
