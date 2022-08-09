import type { SVGProps } from 'react';
import { flatten } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { useXYChartContext } from './useXYChartContext';

// A default bandwidth for a non-band scale on the independent axis.
const defaultBandwidth = 40;

type A11yProps = Partial<
  Pick<SVGProps<Element>, 'role' | 'aria-roledescription' | 'aria-label' | 'aria-labelledby'>
>;

export interface SVGA11ySeriesProps<Datum extends object> {
  dataKeyOrKeysRef: string | readonly string[];
  groupA11yProps?: A11yProps;
  categoryA11yProps: (category: string, data: readonly Datum[]) => A11yProps;
}

export function SVGA11ySeries<Datum extends object>({
  groupA11yProps,
  categoryA11yProps,
  dataKeyOrKeysRef
}: SVGA11ySeriesProps<Datum>) {
  const { horizontal, margin, innerWidth, innerHeight, scales, dataEntryStore } = useXYChartContext();
  const independentDomain = scales.independent.domain();
  const dataKeys = Array.isArray(dataKeyOrKeysRef) ? dataKeyOrKeysRef : [dataKeyOrKeysRef];
  const filteredDataEntries = dataKeys.map((dataKey) => dataEntryStore.getByDataKey(dataKey));

  return (
    <g data-testid="data-series-a11y" {...groupA11yProps}>
      {independentDomain.map((independentDomainValue) => {
        const independentCoord = coerceNumber(scales.independent(independentDomainValue));
        const bandwidth = getScaleBandwidth(scales.independent) || defaultBandwidth;
        const matchingData = flatten(
          filteredDataEntries.map((dataEntry) =>
            dataEntry.getMatchingDataForA11ySeries(independentDomainValue)
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
            {...categoryA11yProps(independentDomainValue, matchingData)}
          />
        );
      })}
    </g>
  );
}
