import { useMemo } from 'react';
import { Annotation, CircleSubject, Connector, Label } from '@visx/annotation';
import { scaleBand } from '@visx/scale';

import { getScaleBandwidth } from './getScaleBandwidth';
import { useBarAnnotation } from './useBarAnnotation';
import { useDataContext } from './useDataContext';

export interface SVGBarGroupAnnotationProps<Datum extends object> {
  dataKey: string;
  datum: Datum;
  dataKeys: readonly string[];
  /** Comparator function to sort `dataKeys` within a bar group. By default the DOM rendering order of `BarGroup`s `children` is used. Must be a stable function. */
  sort?: (dataKeyA: string, dataKeyB: string) => number;
  /** Group band scale padding, [0, 1] where 0 = no padding, 1 = no bar. */
  padding?: number;
}

export function SVGBarGroupAnnotation<Datum extends object>({
  dataKey,
  datum,
  sort,
  dataKeys,
  padding
}: SVGBarGroupAnnotationProps<Datum>) {
  const { independentScale } = useDataContext();

  const groupScale = useMemo(
    () =>
      scaleBand<string>({
        domain: (sort ? [...dataKeys].sort(sort) : dataKeys) as string[],
        range: [0, getScaleBandwidth(independentScale)],
        padding
      }),
    [sort, dataKeys, independentScale, padding]
  );

  const origin = useBarAnnotation(dataKey, datum, groupScale);
  if (!origin) {
    return null;
  }

  return (
    <Annotation x={origin.x} y={origin.y} dx={-40} dy={-50}>
      <Connector stroke="white" pathProps={{ strokeWidth: 2 }} />
      <CircleSubject radius={7} stroke="white" strokeWidth={2} role="presentation" aria-hidden />
      <Label
        title="Context about this point"
        titleFontSize={16}
        titleFontWeight={400}
        titleProps={{ fontFamily: '"Readex Pro"', lineHeight: '1.2em' }}
        showAnchorLine={false}
        backgroundFill="white"
      />
    </Annotation>
  );
}
