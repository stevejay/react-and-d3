import type { ReactNode, SVGProps } from 'react';

import { areaSeriesEventSource, xyChartEventSource } from './constants';
import type { AxisScale, BasicSeriesProps, RenderPathProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export type SVGAreaSeriesProps<Datum extends object> = BasicSeriesProps<Datum> & {
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  renderArea: (props: RenderPathProps<Datum>) => ReactNode;
};

export function SVGAreaSeries<Datum extends object>({
  groupProps,
  springConfig,
  animate = true,
  dataKey,
  enableEvents = true,
  renderArea
}: SVGAreaSeriesProps<Datum>) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore,
    theme
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useXYChartContext<Datum, any>();
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
  // Provide a fallback fill value:
  const fallbackFill = scales.color?.(dataKey) ?? theme?.colors?.[0] ?? 'currentColor';
  return (
    <g data-testid={`area-series-${dataKey}`} {...groupProps}>
      {renderArea({
        dataEntry,
        scales,
        theme,
        horizontal,
        renderingOffset,
        animate: animate && contextAnimate,
        springConfig: springConfig ?? contextSpringConfig,
        color: fallbackFill
      })}
    </g>
  );
}
