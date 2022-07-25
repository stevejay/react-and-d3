import { animated } from 'react-spring';

import { LineProps } from '@/visx-next/types';

import { getTicksData } from './getTicksData';
import { GridRendererProps } from './SVGGrid';
import { useAxisTransitions } from './useAxisTransitions';

export function SVGGridRenderer({
  context,
  // scale,
  // horizontal,
  variableType,
  // innerWidth,
  // innerHeight,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // independentRangePadding,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // dependentRangePadding,
  springConfig,
  animate = true,
  // renderingOffset = 0,
  hideZero,
  tickCount,
  tickValues,
  ...elementProps
}: GridRendererProps<LineProps>) {
  const { horizontal, renderingOffset, independentScale, dependentScale, innerWidth, innerHeight } = context;
  const scale = variableType === 'independent' ? independentScale : dependentScale;
  const gridType =
    variableType === 'independent' ? (horizontal ? 'row' : 'column') : horizontal ? 'column' : 'row';
  const width = variableType === 'independent' ? (horizontal ? innerWidth : 0) : horizontal ? 0 : innerWidth;
  const height =
    variableType === 'independent' ? (horizontal ? 0 : innerHeight) : horizontal ? innerHeight : 0;
  const axisTicks = getTicksData(scale, hideZero, undefined, tickCount, tickValues);
  const transitions = useAxisTransitions(scale, axisTicks, springConfig, animate, renderingOffset);
  return (
    <>
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
          shapeRendering="crispEdges"
          {...elementProps}
        />
      ))}
    </>
  );
}
