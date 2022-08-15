import type { ReactNode } from 'react';
import type { SpringConfig } from 'react-spring';

import type { AxisScale, IDataEntry, RenderAnimatedGlyphProps, ScaleSet, SeriesProps } from './types';
import { useGlyphTransitions } from './useGlyphTransitions';

export type SVGGlyphSeriesRendererProps<Datum extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataEntry: IDataEntry<Datum, any>;
  scales: ScaleSet;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  colorAccessor: (datum: Datum, dataKey: string) => string;
  glyphSize: number | ((datum: Datum, dataKey: string) => number);
  renderGlyph: (props: RenderAnimatedGlyphProps<Datum>) => ReactNode;
  // colorScale: ScaleOrdinal<string, string, never>;
  // component?: SVGGlyphComponent<Datum>;
  // // seriesIsLeaving?: boolean;
  // getRadius: (datum: Datum) => number;
} & Pick<
  SeriesProps<AxisScale, AxisScale, Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
>;

export function SVGGlyphSeriesRenderer<Datum extends object>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  renderGlyph,
  glyphSize
}: // colorScale,
// seriesIsLeaving = false,
//   onBlur,
//   onFocus,
//   onPointerMove,
//   onPointerOut,
//   onPointerUp,
// component: GlyphComponent = SVGCircleGlyph,
// getRadius
SVGGlyphSeriesRendererProps<Datum>) {
  const transitions = useGlyphTransitions<Datum>({
    dataEntry,
    scales,
    horizontal,
    renderingOffset,
    springConfig,
    animate,
    // seriesIsLeaving,
    glyphSize
  });
  const fallbackColor = scales.color?.(dataEntry.dataKey) ?? 'currentColor';
  return (
    <>
      {transitions((springValues, datum, _, index) => {
        const dataKey = dataEntry.dataKey;
        const originalDatum = dataEntry.getOriginalDatumFromRenderingDatum(datum.datum);
        const color = colorAccessor?.(originalDatum, dataKey) ?? fallbackColor;
        return renderGlyph({ springValues, datum: originalDatum, index, dataKey, horizontal, color });
      })}
    </>
  );
}
