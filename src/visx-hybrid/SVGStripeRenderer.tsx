import { getScaleBandwidth, isBandScale } from '@/visx-next/scale';
import { getScaleStep } from '@/visx-next/scale/getScaleStep';
import { RectProps } from '@/visx-next/types';
import { isValidNumber } from '@/visx-next/types/typeguards/isValidNumber';

import { getTicksData } from './getTicksData';
import { GridRendererProps } from './SVGGrid';

export function SVGStripeRenderer({
  context,
  // scale,
  // horizontal,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variableType,
  // innerWidth,
  // innerHeight,
  // independentRangePadding,
  // dependentRangePadding,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  springConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // renderingOffset = 0,
  hideZero,
  tickCount,
  tickValues,
  // elementProps = {}
  ...elementProps
}: // ...lineProps
GridRendererProps<RectProps & { even?: boolean }>) {
  const {
    horizontal,
    independentScale,
    dependentScale,
    independentRangePadding,
    dependentRangePadding,
    innerWidth,
    innerHeight
  } = context;
  const scale = variableType === 'independent' ? independentScale : dependentScale;
  if (!isBandScale(scale)) {
    throw new Error('Must be used with a band scale');
  }
  const step = getScaleStep(scale);
  const bandwidth = getScaleBandwidth(scale);
  const offset = (step - bandwidth) * 0.5;
  const axisTicks = getTicksData(scale, hideZero, undefined, tickCount, tickValues);
  const { even = false, ...rectProps } = elementProps;
  return (
    <>
      {axisTicks.map((axisTick, index) => {
        if (index % 2 === (even ? 0 : 1)) {
          return null;
        }
        const scaledValue = scale(axisTick.value);
        if (!isValidNumber(scaledValue)) {
          return null;
        }
        return (
          <rect
            key={axisTick.value}
            x={horizontal ? dependentRangePadding : scaledValue - offset}
            y={horizontal ? scaledValue - offset : independentRangePadding}
            width={horizontal ? innerWidth - dependentRangePadding * 2 : step}
            height={horizontal ? step : innerHeight - independentRangePadding * 2}
            fill="currentColor"
            // fill={colorAccessor?.(datum, dataKey) ?? restBarProps.fill}
            // style={{ ...style, opacity }}
            shapeRendering="crispEdges" // {shapeRendering}
            // className={barClassName}
            // {...restBarProps}
            {...rectProps}
          />
        );
      })}
    </>
  );
}
