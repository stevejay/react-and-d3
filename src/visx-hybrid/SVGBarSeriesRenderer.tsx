import type { ReactNode, SVGProps } from 'react';
import type { SpringConfig } from 'react-spring';

import type { IDataEntry, IScaleSet, RenderAnimatedBarProps } from './types';
import { useBarTransitions } from './useBarTransitions';

export type SVGBarSeriesRendererProps<Datum extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataEntry: IDataEntry<Datum, any>;
  scales: IScaleSet;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  colorAccessor: (datum: Datum) => string;
  renderBar: (props: RenderAnimatedBarProps<Datum>) => ReactNode;
  elementProps?: (datum: Datum) => Omit<SVGProps<SVGElement>, 'ref'>;
  seriesIsLeaving?: boolean;
} & Pick<
  React.SVGProps<SVGRectElement | SVGPathElement>,
  'onPointerMove' | 'onPointerOut' | 'onPointerDown' | 'onPointerUp' | 'onBlur' | 'onFocus'
>;

export function SVGBarSeriesRenderer<Datum extends object>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  seriesIsLeaving = false,
  renderBar,
  ...rest
}: SVGBarSeriesRendererProps<Datum>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transitions = useBarTransitions<Datum, any>({
    dataEntry,
    scales,
    horizontal,
    renderingOffset,
    springConfig,
    animate,
    seriesIsLeaving
  });
  const fallbackColor = scales.color?.(dataEntry.dataKey) ?? 'currentColor';
  return (
    <>
      {transitions((springValues, datum, _, index) => {
        const dataKey = dataEntry.dataKey;
        const originalDatum = dataEntry.getOriginalDatumFromRenderingDatum(datum);
        const color = colorAccessor?.(originalDatum) ?? fallbackColor;
        return renderBar({ springValues, datum: originalDatum, index, dataKey, horizontal, color, ...rest });
      })}
    </>
  );
}
