import type { ReactNode, SVGProps } from 'react';

import { defaultGlyphSize, glyphSeriesEventSource, xyChartEventSource } from './constants';
import { SVGGlyphSeriesRenderer } from './SVGGlyphSeriesRenderer';
import type { BasicSeriesProps, RenderAnimatedGlyphProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useXYChartContext } from './useXYChartContext';

export type SVGGlyphSeriesProps<Datum extends object> = BasicSeriesProps<Datum> & {
  groupProps?: SVGProps<SVGGElement>;
  colorAccessor?: (datum: Datum) => string;
  glyphSize?: number | ((datum: Datum) => number);
  renderGlyph: (props: RenderAnimatedGlyphProps<Datum>) => ReactNode;
};

export function SVGGlyphSeries<Datum extends object>({
  dataKey,
  groupProps,
  springConfig,
  animate = true,
  enableEvents = true,
  glyphSize = defaultGlyphSize,
  renderGlyph,
  onBlur,
  onFocus,
  onPointerMove,
  onPointerDown,
  onPointerOut,
  onPointerUp,
  colorAccessor
}: SVGGlyphSeriesProps<Datum>) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore
  } = useXYChartContext<Datum>();
  const dataEntry = dataEntryStore.getByDataKey(dataKey);
  const ownEventSourceKey = `${glyphSeriesEventSource}-${dataKey}`;
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
    <g data-testid={`glyph-series-${dataKey}`} {...groupProps}>
      {
        <SVGGlyphSeriesRenderer<Datum>
          scales={scales}
          dataEntry={dataEntry}
          horizontal={horizontal}
          renderingOffset={renderingOffset}
          animate={animate && contextAnimate}
          springConfig={springConfig ?? contextSpringConfig}
          colorAccessor={colorAccessor ?? dataEntry.colorAccessor}
          glyphSize={glyphSize}
          renderGlyph={renderGlyph}
          {...eventEmitters}
        />
      }
    </g>
  );
}
