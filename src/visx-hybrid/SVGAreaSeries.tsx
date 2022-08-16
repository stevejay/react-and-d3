import type { ReactNode, SVGProps } from 'react';

import { areaSeriesEventSource, xyChartEventSource } from './constants';
import type { AxisScale, BasicSeriesProps, RenderPathProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export type SVGAreaSeriesProps<Datum extends object> = BasicSeriesProps<Datum> & {
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  renderArea: (props: RenderPathProps<Datum>) => ReactNode;
  renderPath?: (props: RenderPathProps<Datum>) => ReactNode;
};

export function SVGAreaSeries<Datum extends object>({
  groupProps,
  springConfig,
  animate = true,
  dataKey,
  enableEvents = true,
  renderArea,
  renderPath
}: SVGAreaSeriesProps<Datum>) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore,
    theme
  } = useXYChartContext<Datum>();
  const dataEntry = dataEntryStore.getByDataKey(dataKey);
  const ownEventSourceKey = `${areaSeriesEventSource}-${dataKey}`;
  // const eventEmitters =
  useSeriesEvents<AxisScale, AxisScale, Datum>({
    dataKeyOrKeysRef: dataKey,
    enableEvents,
    // onBlur,
    // onFocus,
    // onPointerMove,
    // onPointerOut,
    // onPointerUp,
    source: ownEventSourceKey,
    allowedSources: [xyChartEventSource, ownEventSourceKey]
  });
  const resolvedAnimate = animate && contextAnimate;
  const resolvedSpringConfig = springConfig ?? contextSpringConfig;
  // Provide a fallback fill value:
  const fallbackFill = scales.color?.(dataKey) ?? theme?.colors?.[0] ?? 'currentColor';
  // Provide a fallback stroke value:
  const fallbackStroke = scales.color?.(dataKey) ?? theme?.colors?.[0] ?? 'currentColor';
  return (
    <g data-testid={`area-series-${dataKey}`} {...groupProps}>
      {renderArea({
        dataEntry,
        scales,
        theme,
        horizontal,
        renderingOffset,
        animate: resolvedAnimate,
        springConfig: resolvedSpringConfig,
        color: fallbackFill
      })}
      {renderPath &&
        renderPath({
          dataEntry,
          scales,
          theme,
          horizontal,
          renderingOffset,
          animate: resolvedAnimate,
          springConfig: resolvedSpringConfig,
          color: fallbackStroke
        })}
    </g>
  );
}
