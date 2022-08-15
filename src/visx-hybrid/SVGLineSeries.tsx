import type { ReactNode, SVGProps } from 'react';

import { lineSeriesEventSource, xyChartEventSource } from './constants';
import type { AxisScale, BasicSeriesProps, RenderPathProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export type SVGLineSeriesProps<Datum extends object> = BasicSeriesProps<Datum> & {
  groupProps?: SVGProps<SVGGElement>;
  renderPath: (props: RenderPathProps<Datum>) => ReactNode;
};

export function SVGLineSeries<Datum extends object>({
  dataKey,
  animate = true,
  springConfig,
  groupProps,
  enableEvents = true,
  renderPath
}: SVGLineSeriesProps<Datum>) {
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
  const ownEventSourceKey = `${lineSeriesEventSource}-${dataKey}`;
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
  // Provide a fallback stroke value:
  const fallbackStroke = scales.color?.(dataKey) ?? theme?.colors?.[0] ?? 'currentColor';
  return (
    <g data-testid={`line-series-${dataKey}`} {...groupProps}>
      {renderPath({
        dataEntry,
        scales,
        theme,
        horizontal,
        renderingOffset,
        animate: animate && contextAnimate,
        springConfig: springConfig ?? contextSpringConfig,
        color: fallbackStroke
      })}
    </g>
  );
}
