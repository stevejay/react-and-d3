import type { ReactNode, SVGProps } from 'react';
import { SpringConfig } from 'react-spring';

import { barSeriesEventSource, xyChartEventSource } from './constants';
import { SVGBarSeriesRenderer } from './SVGBarSeriesRenderer';
import type { AxisScale, RenderAnimatedBarProps, ScaleInput } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export type SVGBarSeriesProps<Datum extends object> = {
  springConfig?: SpringConfig;
  animate?: boolean;
  dataKey: string;
  data: readonly Datum[];
  keyAccessor?: (datum: Datum, dataKey?: string) => string | number;
  independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  colorAccessor?: (datum: Datum, dataKey: string) => string;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  enableEvents?: boolean;
  renderBar: (props: RenderAnimatedBarProps<Datum>) => ReactNode;
};

export function SVGBarSeries<Datum extends object>({
  groupProps,
  springConfig,
  animate = true,
  dataKey,
  enableEvents = true,
  colorAccessor,
  renderBar
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
          // {...events}
          renderBar={renderBar}
        />
      }
    </g>
  );
}
