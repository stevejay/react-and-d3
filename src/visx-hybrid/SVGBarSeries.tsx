import type { ReactNode, SVGProps } from 'react';

import { barSeriesEventSource, xyChartEventSource } from './constants';
import { SVGBarSeriesRenderer } from './SVGBarSeriesRenderer';
import type { BasicSeriesProps, RenderAnimatedBarProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export type SVGBarSeriesProps<Datum extends object> = BasicSeriesProps<Datum> & {
  colorAccessor?: (datum: Datum) => string;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  renderBar: (props: RenderAnimatedBarProps<Datum>) => ReactNode;
};

export function SVGBarSeries<Datum extends object>({
  groupProps,
  springConfig,
  animate = true,
  dataKey,
  enableEvents = true,
  colorAccessor,
  renderBar,
  onBlur,
  onFocus,
  onPointerMove,
  onPointerDown,
  onPointerOut,
  onPointerUp
}: SVGBarSeriesProps<Datum>) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore
  } = useXYChartContext<Datum>();
  const dataEntry = dataEntryStore.getByDataKey(dataKey);
  const ownEventSourceKey = `${barSeriesEventSource}-${dataKey}`;
  const eventEmitters = useSeriesEvents<Datum>({
    dataKeyOrKeysRef: dataKey,
    enableEvents,
    onBlur,
    onFocus,
    onPointerMove,
    onPointerDown,
    onPointerOut,
    onPointerUp,
    source: ownEventSourceKey,
    allowedSources: [xyChartEventSource, ownEventSourceKey]
  });
  return (
    <g data-testid={`bar-series-${dataKey}`} {...groupProps}>
      {
        <SVGBarSeriesRenderer
          scales={scales}
          dataEntry={dataEntry}
          horizontal={horizontal}
          renderingOffset={renderingOffset}
          animate={animate && contextAnimate}
          springConfig={springConfig ?? contextSpringConfig}
          colorAccessor={colorAccessor ?? dataEntry.colorAccessor}
          renderBar={renderBar}
          {...eventEmitters}
        />
      }
    </g>
  );
}
