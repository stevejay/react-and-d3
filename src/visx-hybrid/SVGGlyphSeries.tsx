import type { SVGProps } from 'react';
import { SpringConfig } from 'react-spring';

import { defaultGlyphRadius, glyphSeriesEventSource, xyChartEventSource } from './constants';
import { createScaleFromScaleConfig } from './createScaleFromScaleConfig';
import { SVGGlyphSeriesRenderer } from './SVGGlyphSeriesRenderer';
import type { AxisScale, ScaleConfig, ScaleInput, SVGGlyphComponent } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export type SVGGlyphSeriesProps<Datum extends object> = {
  springConfig?: SpringConfig;
  animate?: boolean;
  dataKey: string;
  data: readonly Datum[];
  keyAccessor?: (datum: Datum, dataKey?: string) => string;
  independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  colorAccessor?: (datum: Datum, dataKey: string) => string;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  enableEvents?: boolean;
  component?: SVGGlyphComponent<Datum>;
  radius?: number;
  radiusScale?: ScaleConfig<number>;
  radiusAccessor?: (datum: Datum) => number;
};

export function SVGGlyphSeries<Datum extends object>({
  groupProps,
  springConfig,
  animate = true,
  dataKey,
  enableEvents = true,
  colorAccessor,
  component,
  radius = defaultGlyphRadius,
  radiusScale: radiusScaleConfig,
  radiusAccessor
}: SVGGlyphSeriesProps<Datum>) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore
  } = useXYChartContext();
  const dataEntry = dataEntryStore.getByDataKey(dataKey);
  const ownEventSourceKey = `${glyphSeriesEventSource}-${dataKey}`;
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
  const radiusScale =
    radiusScaleConfig && radiusAccessor
      ? createScaleFromScaleConfig(dataEntry.getDataValues(radiusAccessor), radiusScaleConfig)
      : undefined;
  const getRadius = (datum: Datum) =>
    radiusScale && radiusAccessor ? (radiusScale(radiusAccessor(datum)) as number) : radius;
  return (
    <g data-testid={`glyph-series-${dataKey}`} {...groupProps}>
      {
        <SVGGlyphSeriesRenderer
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
          getRadius={getRadius}
        />
      }
    </g>
  );
}
