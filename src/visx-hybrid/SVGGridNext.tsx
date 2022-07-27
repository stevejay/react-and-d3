import { SVGProps } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { AxisScale, ScaleInput } from '@/visx-next/types';

import { getTicksData } from './getTicksData';
import { GridType } from './types';
import { useDataContext } from './useDataContext';
import { useGridTransitions } from './useGridTransitions';

interface SVGGridCoreProps {
  variableType: 'independent' | 'dependent';
  springConfig?: SpringConfig;
  animate?: boolean;
  renderingOffset?: number;
  hideZero?: boolean;
  ignoreRangePadding?: boolean;
  tickCount?: number;
  tickValues?: ScaleInput<AxisScale>[];
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
}

export type SVGGridProps = SVGGridCoreProps &
  Omit<Omit<SVGProps<SVGLineElement>, 'ref' | 'x1' | 'y1' | 'x2' | 'y2'>, keyof SVGGridCoreProps>;

// {
//   variableType: 'independent' | 'dependent';
//   springConfig?: SpringConfig;
//   animate?: boolean;
//   renderingOffset?: number;
//   hideZero?: boolean;
//   ignoreRangePadding?: boolean;
//   tickCount?: number;
//   tickValues?: ScaleInput<AxisScale>[];
//   groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
//   lineProps?: Omit<SVGProps<SVGLineElement>, 'ref' | 'x1' | 'y1' | 'x2' | 'y2'>;
// }

export function SVGGrid({
  variableType,
  springConfig,
  animate,
  groupProps,
  hideZero = false,
  ignoreRangePadding = true,
  tickCount,
  tickValues,
  ...restProps
}: SVGGridProps) {
  const {
    independentScale,
    dependentScale,
    independentRangePadding,
    dependentRangePadding,
    horizontal,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    renderingOffset,
    margin,
    innerWidth,
    innerHeight
  } = useDataContext();

  const scale = variableType === 'independent' ? independentScale : dependentScale;
  const rangePadding = variableType === 'independent' ? dependentRangePadding : independentRangePadding;
  const gridType: GridType =
    variableType === 'independent' ? (horizontal ? 'row' : 'column') : horizontal ? 'column' : 'row';
  const ticks = getTicksData(scale, hideZero, undefined, tickCount, tickValues);
  const transitions = useGridTransitions(
    gridType,
    scale,
    ignoreRangePadding ? 0 : rangePadding,
    margin,
    innerWidth,
    innerHeight,
    ticks,
    springConfig ?? contextSpringConfig,
    animate ?? contextAnimate,
    renderingOffset
  );
  const { style, ...restPropsWithoutStyle } = restProps;

  return (
    <g data-testid={`grid-${variableType}`} {...groupProps}>
      {transitions(({ opacity, x1, y1, x2, y2 }) => (
        <animated.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{ ...style, opacity }}
          role="presentation"
          aria-hidden
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="square"
          shapeRendering="crispEdges"
          {...restPropsWithoutStyle}
        />
      ))}
    </g>
  );
}
