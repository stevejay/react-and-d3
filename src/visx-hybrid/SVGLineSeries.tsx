import type { SVGProps } from 'react';
import { SpringConfig } from 'react-spring';
import { CurveFactory, CurveFactoryLineOnly, curveLinear } from 'd3-shape';

import { barSeriesEventSource, xyChartEventSource } from './constants';
import { SVGWipedPath } from './SVGWipedPath';
import type { AxisScale, PathProps, ScaleInput, SVGAnimatedPathComponent } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export type SVGLineSeriesProps<Datum extends object> = {
  springConfig?: SpringConfig;
  animate?: boolean;
  dataKey: string;
  data: readonly Datum[];
  keyAccessor?: (datum: Datum, dataKey?: string) => string | number;
  independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  // colorAccessor?: (datum: Datum, dataKey: string) => string;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  enableEvents?: boolean;
  component?: SVGAnimatedPathComponent<Datum>;
  curve?: CurveFactory | CurveFactoryLineOnly;
  color?: string | ((dataKey: string) => string);
  pathProps?: PathProps | ((dataKey: string) => PathProps);
};

export function SVGLineSeries<Datum extends object>({
  groupProps,
  springConfig,
  animate = true,
  dataKey,
  enableEvents = true,
  curve = curveLinear,
  color,
  pathProps,
  component: Component = SVGWipedPath
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
  const resolvedColor =
    (typeof color === 'function' ? color(dataKey) : color) ??
    scales.color?.(dataKey) ??
    theme?.colors?.[0] ??
    '#666';
  return (
    <g data-testid={`line-series-${dataKey}`} {...groupProps}>
      {/* <SVGWipedPath
        dataEntry={dataEntry}
        scales={scales}
        horizontal={horizontal}
        renderingOffset={renderingOffset}
        animate={animate && contextAnimate}
        springConfig={springConfig ?? contextSpringConfig}
        color={resolvedColor}
        curve={curve}
        pathProps={pathProps}
      /> */}
      <Component
        dataEntry={dataEntry}
        scales={scales}
        horizontal={horizontal}
        renderingOffset={renderingOffset}
        animate={animate && contextAnimate}
        springConfig={springConfig ?? contextSpringConfig}
        color={resolvedColor}
        curve={curve}
        pathProps={pathProps}
      />
    </g>
  );
}
