import type { SpringConfig } from 'react-spring';
import { ScaleOrdinal } from 'd3-scale';

import { SVGCircleGlyph } from './SVGCircleGlyph';
import type { AxisScale, IDatumEntry, ScaleSet, SeriesProps, SVGGlyphComponent } from './types';
import { useGlyphTransitions } from './useGlyphTransitions';

export type SVGGlyphSeriesRendererProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  dataEntry: IDatumEntry;
  scales: ScaleSet;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  colorAccessor: (datum: Datum, dataKey: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
  component?: SVGGlyphComponent<Datum>;
  seriesIsLeaving?: boolean;
  getRadius: (datum: Datum) => number;
} & Pick<
  SeriesProps<IndependentScale, DependentScale, Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
>;

export function SVGGlyphSeriesRenderer<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  colorScale,
  seriesIsLeaving = false,
  //   onBlur,
  //   onFocus,
  //   onPointerMove,
  //   onPointerOut,
  //   onPointerUp,
  component: GlyphComponent = SVGCircleGlyph,
  getRadius
}: SVGGlyphSeriesRendererProps<IndependentScale, DependentScale, Datum>) {
  const transitions = useGlyphTransitions<Datum>({
    dataEntry,
    scales,
    horizontal,
    renderingOffset,
    springConfig,
    animate,
    seriesIsLeaving,
    getRadius
  });
  return (
    <>
      {transitions((springValues, datum, _, index) => (
        <GlyphComponent
          springValues={springValues}
          datum={datum as Datum} // TODO fix this cast
          index={index}
          dataKey={dataEntry.dataKey}
          horizontal={horizontal}
          colorScale={colorScale}
          colorAccessor={colorAccessor}
        />
      ))}
    </>
  );
}
