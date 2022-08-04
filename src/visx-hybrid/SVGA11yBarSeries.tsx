import { SVGProps } from 'react';
import { flatten } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { useDataContext } from './useDataContext';

// A default bandwidth for a non-band scale on the independent axis.
const defaultBandwidth = 40;

type A11yProps = Partial<
  Pick<SVGProps<Element>, 'role' | 'aria-roledescription' | 'aria-label' | 'aria-labelledby'>
>;

export interface SVGA11yBarSeriesProps<Datum extends object> {
  dataKeyOrKeys: string | readonly string[];
  groupA11yProps?: A11yProps;
  categoryA11yProps: (category: string, data: readonly Datum[]) => A11yProps;
}

export function SVGA11yBarSeries<Datum extends object>({
  groupA11yProps,
  categoryA11yProps,
  dataKeyOrKeys
}: SVGA11yBarSeriesProps<Datum>) {
  const { horizontal, independentScale, dataEntries, margin, innerWidth, innerHeight } = useDataContext();

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
            dataEntry?.data
              .filter((datum) => dataEntry.independentAccessor(datum) === independentDomainValue)
              .map((datum) => dataEntry.underlyingDatumAccessor(datum))
          )
        );

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
