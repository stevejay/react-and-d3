import type { SVGProps } from 'react';
import { SpringConfig } from 'react-spring';

import { barSeriesEventSource, xyChartEventSource } from './constants';
import { SVGBarSeriesRenderer } from './SVGBarSeriesRenderer';
import type { AxisScale, ScaleInput, SVGBarComponent } from './types';
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
  component?: SVGBarComponent<Datum>;
};

export function SVGBarSeries<Datum extends object>({
  groupProps,
  springConfig,
  animate = true,
  dataKey,
  enableEvents = true,
  colorAccessor,
  component
}: SVGBarSeriesProps<Datum>) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useXYChartContext<Datum, any>();
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
    allowedSources: [xyChartEventSource]
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
          colorScale={scales.color}
          // {...events}
          component={component}
        />
      }
    </g>
  );
}
