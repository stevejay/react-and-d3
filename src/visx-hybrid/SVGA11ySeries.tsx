// import { coerceNumber } from './coerceNumber';
// import { defaultA11yElementBandwidth } from './constants';
// import { getScaleBandwidth } from './getScaleBandwidth';
// import { isBandScale } from './isBandScale';
// import { isDefined } from './isDefined';
import type { A11yProps } from './types';
import { useXYChartContext } from './useXYChartContext';

export interface SVGA11ySeriesProps<Datum extends object> {
  dataKeyRef: string;
  groupA11yProps?: (dataKey: string) => A11yProps;
  datumA11yProps: (dataKey: string, datum: Datum) => A11yProps;
}

/** Renders a series of accessible SVG elements for the given series. */
export function SVGA11ySeries<Datum extends object>({
  dataKeyRef,
  groupA11yProps,
  datumA11yProps
}: SVGA11ySeriesProps<Datum>) {
  const { dataEntryStore } = useXYChartContext<Datum>();
  const dataEntry = dataEntryStore.getByDataKey(dataKeyRef);
  if (!dataEntry) {
    return null;
  }
  return (
    <g
      data-testid={`data-ally-series-${dataKeyRef}`}
      role="graphics-object"
      {...groupA11yProps?.(dataKeyRef)}
    >
      {dataEntry.getOriginalData().map((datum) => {
        return (
          <rect
            key={dataEntry.keyAccessor(datum)}
            x={0} //={horizontal ? chartDimensions.chartAreaExcludingRangePadding.x : independentCoord}
            y={0} //{horizontal ? independentCoord : chartDimensions.chartAreaExcludingRangePadding.y}
            width={50} //={horizontal ? chartDimensions.chartAreaExcludingRangePadding.width : bandwidth}
            height={50} //={horizontal ? bandwidth : chartDimensions.chartAreaExcludingRangePadding.height}
            fill="transparent"
            role="graphics-symbol"
            {...datumA11yProps(dataKeyRef, datum)}
          />
        );
      })}

      {/* {independentDomain.filter(isDefined).map((independentDomainValue) => {
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
      })} */}
    </g>
  );
}
