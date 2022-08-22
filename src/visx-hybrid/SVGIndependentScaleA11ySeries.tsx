import { coerceNumber } from './coerceNumber';
import { defaultA11yElementBandwidth } from './constants';
import { getScaleBandwidth } from './getScaleBandwidth';
import { isBandScale } from './isBandScale';
import { isDefined } from './isDefined';
import type { A11yProps } from './types';
import { useXYChartContext } from './useXYChartContext';

export interface SVGIndependentScaleA11ySeriesProps<Datum extends object> {
  dataKeyOrKeysRef: string | readonly string[];
  groupA11yProps?: A11yProps;
  categoryA11yProps: (category: string, data: readonly Datum[]) => A11yProps;
}

/** Renders a series of accessible SVG elements for the given series. */
export function SVGIndependentScaleA11ySeries<Datum extends object>({
  groupA11yProps,
  categoryA11yProps,
  dataKeyOrKeysRef
}: SVGIndependentScaleA11ySeriesProps<Datum>) {
  const { horizontal, chartDimensions, scales, dataEntryStore } = useXYChartContext<Datum>();
  const dataKeys = Array.isArray(dataKeyOrKeysRef) ? dataKeyOrKeysRef : [dataKeyOrKeysRef];
  const filteredDataEntries = dataKeys.map((dataKey) => dataEntryStore.getByDataKey(dataKey));
  if (!filteredDataEntries) {
    return null;
  }
  const independentDomain = isBandScale(scales.independent)
    ? scales.independent.domain()
    : filteredDataEntries[0]
        .getOriginalData()
        .map((datum) => filteredDataEntries[0].independentAccessor(datum));
  return (
    <g data-testid={`data-ally-series-${dataKeys.join('-')}`} {...groupA11yProps}>
      {independentDomain.filter(isDefined).map((independentDomainValue) => {
        const independentCoord = coerceNumber(scales.independent(independentDomainValue));
        const bandwidth = getScaleBandwidth(scales.independent) || defaultA11yElementBandwidth;
        const matchingData = filteredDataEntries
          .map((dataEntry) => dataEntry.getOriginalDataByIndependentValue(independentDomainValue))
          .reduce((acc, val) => acc.concat(val), []);
        return (
          <rect
            key={independentDomainValue}
            x={horizontal ? chartDimensions.chartAreaExcludingRangePadding.x : independentCoord}
            y={horizontal ? independentCoord : chartDimensions.chartAreaExcludingRangePadding.y}
            width={horizontal ? chartDimensions.chartAreaExcludingRangePadding.width : bandwidth}
            height={horizontal ? bandwidth : chartDimensions.chartAreaExcludingRangePadding.height}
            fill="transparent"
            role="graphics-symbol"
            {...categoryA11yProps(independentDomainValue, matchingData)}
          />
        );
      })}
    </g>
  );
}
