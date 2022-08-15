import type { ReactNode, SVGProps } from 'react';

import { defaultGlyphSize, glyphSeriesEventSource, xyChartEventSource } from './constants';
import { SVGGlyphSeriesRenderer } from './SVGGlyphSeriesRenderer';
import type { AxisScale, BasicSeriesProps, RenderAnimatedGlyphProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export type SVGGlyphSeriesProps<Datum extends object> = BasicSeriesProps<Datum> & {
  groupProps?: SVGProps<SVGGElement>;
  colorAccessor?: (datum: Datum, dataKey: string) => string;
  // component?: SVGGlyphComponent<Datum>;
  // radius?: number;
  // radiusScale?: ScaleConfig<number>;
  // radiusAccessor?: (datum: Datum) => number;
  glyphSize?: number | ((datum: Datum, dataKey: string) => number);
  renderGlyph: (props: RenderAnimatedGlyphProps<Datum>) => ReactNode;
};

export function SVGGlyphSeries<Datum extends object>({
  dataKey,
  groupProps,
  springConfig,
  animate = true,
  enableEvents = true,
  glyphSize = defaultGlyphSize,
  renderGlyph
}: SVGGlyphSeriesProps<Datum>) {
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
    allowedSources: [xyChartEventSource, ownEventSourceKey]
  });
  // const radiusScale =
  //   radiusScaleConfig && radiusAccessor
  //     ? createScaleFromScaleConfig(dataEntry.getMappedData(radiusAccessor), radiusScaleConfig)
  //     : undefined;
  // const getRadius = (datum: Datum) =>
  //   radiusScale && radiusAccessor ? (radiusScale(radiusAccessor(datum)) as number) : radius;
  return (
    <g data-testid={`glyph-series-${dataKey}`} {...groupProps}>
      {
        <SVGGlyphSeriesRenderer<Datum>
          scales={scales}
          dataEntry={dataEntry}
          horizontal={horizontal}
          renderingOffset={renderingOffset}
          animate={animate && contextAnimate}
          springConfig={springConfig ?? contextSpringConfig}
          colorAccessor={dataEntry.colorAccessor}
          // colorScale={scales.color}
          // {...events}
          glyphSize={glyphSize}
          renderGlyph={renderGlyph}
        />
      }
    </g>
  );
}
