import type { ReactNode } from 'react';
import type { SpringConfig } from 'react-spring';

import type { IDataEntry, IScaleSet, RenderAnimatedGlyphProps } from './types';
import { useGlyphTransitions } from './useGlyphTransitions';

export type SVGGlyphSeriesRendererProps<Datum extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataEntry: IDataEntry<Datum, any>;
  scales: IScaleSet;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  colorAccessor: (datum: Datum) => string;
  glyphSize: number | ((datum: Datum) => number);
  renderGlyph: (props: RenderAnimatedGlyphProps<Datum>) => ReactNode;
} & Pick<
  React.SVGProps<SVGRectElement | SVGPathElement | SVGRectElement | SVGCircleElement>, // TODO ???
  'onPointerMove' | 'onPointerOut' | 'onPointerDown' | 'onPointerUp' | 'onBlur' | 'onFocus'
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
  glyphSize,
  ...rest
}: SVGGlyphSeriesRendererProps<Datum>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transitions = useGlyphTransitions<Datum, any>({
    dataEntry,
    scales,
    horizontal,
    renderingOffset,
    springConfig,
    animate,
    glyphSize
  });
  const fallbackColor = scales.color?.(dataEntry.dataKey) ?? 'currentColor';
  return (
    <>
      {transitions((springValues, datum, _, index) => {
        const dataKey = dataEntry.dataKey;
        const originalDatum = dataEntry.getOriginalDatumFromRenderingDatum(datum.datum);
        const color = colorAccessor?.(originalDatum) ?? fallbackColor;
        return renderGlyph({
          springValues,
          datum: originalDatum,
          index,
          dataKey,
          horizontal,
          color,
          ...rest
        });
      })}
    </>
  );
}
