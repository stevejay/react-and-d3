import type { SVGProps } from 'react';
import { SpringConfig } from 'react-spring';
import type { CurveFactory } from 'd3-shape';
import { area as d3Area } from 'd3-shape';

import { areaSeriesEventSource, xyChartEventSource } from './constants';
import { getScaleBaseline } from './getScaleBaseline';
import { getScaledValueFactory } from './getScaledFactoryValue';
import { isValidNumber } from './isValidNumber';
import { setNumberOrNumberAccessor } from './setNumberOrNumberAccessor';
// import { SVGAreaSeriesRenderer } from './SVGAreaSeriesRenderer';
import type { AreaPathConfig, AxisScale, ScaleInput } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export function area<Datum>({ x, x0, x1, y, y0, y1, defined, curve }: AreaPathConfig<Datum> = {}) {
  const path = d3Area<Datum>();
  if (x) {
    setNumberOrNumberAccessor(path.x, x);
  }
  if (x0) {
    setNumberOrNumberAccessor(path.x0, x0);
  }
  if (x1) {
    setNumberOrNumberAccessor(path.x1, x1);
  }
  if (y) {
    setNumberOrNumberAccessor(path.y, y);
  }
  if (y0) {
    setNumberOrNumberAccessor(path.y0, y0);
  }
  if (y1) {
    setNumberOrNumberAccessor(path.y1, y1);
  }
  if (defined) {
    path.defined(defined);
  }
  if (curve) {
    path.curve(curve);
  }
  return path;
}

export type SVGAreaSeriesProps<Datum extends object> = {
  springConfig?: SpringConfig;
  animate?: boolean;
  dataKey: string;
  data: readonly Datum[];
  keyAccessor?: (datum: Datum, dataKey?: string) => string | number;
  independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  dependent0Accessor?: (datum: Datum) => ScaleInput<AxisScale>;
  colorAccessor?: (datum: Datum, dataKey: string) => string;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  enableEvents?: boolean;
  /** Sets the curve factory (from @visx/curve or d3-curve) for the line generator. Defaults to curveLinear. */
  curve?: CurveFactory;
  renderLine?: boolean;
  //   component?: SVGBarComponent<Datum>;
};

export function SVGAreaSeries<Datum extends object>({
  groupProps,
  // springConfig,
  // animate = true,
  dataKey,
  enableEvents = true,
  // colorAccessor,
  // component,
  dependent0Accessor,
  curve
}: // renderLine = true
SVGAreaSeriesProps<Datum>) {
  const {
    scales,
    horizontal,
    // renderingOffset,
    // springConfig: contextSpringConfig,
    // animate: contextAnimate,
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
    allowedSources: [xyChartEventSource]
  });

  const numericScaleBaseline = getScaleBaseline(scales.dependent);

  const getScaledDependent0 = dependent0Accessor
    ? getScaledValueFactory(scales.dependent, dependent0Accessor)
    : undefined;

  const getScaledDependent = getScaledValueFactory(scales.dependent, dataEntry.dependentAccessor);

  const getScaledIndependent = getScaledValueFactory(scales.independent, dataEntry.independentAccessor);

  const isDefined = (datum: Datum) =>
    isValidNumber(scales.independent(dataEntry.independentAccessor(datum))) &&
    isValidNumber(scales.dependent(dataEntry.dependentAccessor(datum)));

  const color = scales.color?.(dataKey) ?? theme?.colors?.[0] ?? '#222';

  const path = area<Datum>(
    horizontal
      ? {
          x0: getScaledDependent0 ?? numericScaleBaseline,
          x1: getScaledDependent,
          y: getScaledIndependent,
          defined: isDefined,
          curve
        }
      : {
          x: getScaledIndependent,
          y0: getScaledDependent0 ?? numericScaleBaseline,
          y1: getScaledDependent,
          defined: isDefined,
          curve
        }
  );

  return (
    <g data-testid={`area-series-${dataKey}`} {...groupProps}>
      <path
        className="visx-area"
        d={dataEntry.createShape(path) ?? ''}
        fill={color}
        stroke="transparent"
        strokeLinecap="round" // without this a datum surrounded by nulls will not be visible
        //   {...restProps}
      />
      {/* {
        <SVGAreaSeriesRenderer
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
      } */}
    </g>
  );
}
