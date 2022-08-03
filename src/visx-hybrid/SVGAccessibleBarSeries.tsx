import { SVGProps } from 'react';
import { flatten, identity } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import type { AxisScale, DataEntry, Margin } from './types';

// A default bandwidth for a non-band scale on the independent axis.
const defaultBandwidth = 40;

type A11yProps = Partial<
  Pick<SVGProps<Element>, 'role' | 'aria-roledescription' | 'aria-label' | 'aria-labelledby'>
>;

export interface SVGAccessibleBarSeriesProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> {
  horizontal: boolean;
  independentScale: IndependentScale;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  groupA11yProps?: A11yProps;
  dataKeyOrKeys: string | readonly string[];
  dataEntries: readonly DataEntry<IndependentScale, DependentScale, Datum, Datum>[];
  categoryA11yProps: (category: string, data: readonly Datum[]) => A11yProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datumAccessor?: (datum: any) => Datum;
}

export function SVGAccessibleBarSeries<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  horizontal,
  independentScale,
  innerWidth,
  innerHeight,
  margin,
  groupA11yProps,
  categoryA11yProps,
  dataKeyOrKeys,
  dataEntries,
  datumAccessor = identity
}: SVGAccessibleBarSeriesProps<IndependentScale, DependentScale, Datum>) {
  const independentDomain = independentScale.domain();

  const dataKeys = Array.isArray(dataKeyOrKeys) ? dataKeyOrKeys : [dataKeyOrKeys];
  const filteredDataEntries = dataKeys
    .map((dataKey) => dataEntries.find((entry) => entry.dataKey === dataKey))
    .filter((dataEntry) => Boolean(dataEntry));

  return (
    <g data-testid="data-series-a11y" {...groupA11yProps}>
      {independentDomain.map((independentDomainValue) => {
        const independentCoord = coerceNumber(independentScale(independentDomainValue));
        const bandwidth = getScaleBandwidth(independentScale) || defaultBandwidth;

        const categoryData = flatten(
          filteredDataEntries.map((dataEntry) =>
            dataEntry?.data.filter((datum) => dataEntry.independentAccessor(datum) === independentDomainValue)
          )
        ).map(datumAccessor);

        return (
          <rect
            key={independentDomainValue}
            x={horizontal ? margin.left : independentCoord}
            y={horizontal ? independentCoord : margin.top}
            height={horizontal ? bandwidth : innerHeight}
            width={horizontal ? innerWidth : bandwidth}
            fill="transparent"
            role="graphics-symbol"
            {...categoryA11yProps(independentDomainValue, categoryData)}
          />
        );
      })}
    </g>
  );
}
