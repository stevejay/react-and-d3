import { memo, ReactElement, Ref } from 'react';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgChartAreaGroup } from '@/components/SvgChartAreaGroup';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgStackedBars } from '@/components/SvgStackedBars';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomainForSeriesData } from '@/hooks/useContinuousDomainForSeriesData';
import { useLinearScale } from '@/hooks/useLinearScale';
import { useOrdinalDomain } from '@/hooks/useOrdinalDomain';
import { useOrdinalScale } from '@/hooks/useOrdinalScale';
import type { CategoryValueListDatum, DomainValue, Margins } from '@/types';
import { getValueListDatumSum } from '@/utils/dataUtils';

export type HorizontalStackedBarChartProps<CategoryT extends DomainValue> = {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  seriesKeys: readonly string[];
  colorRange: readonly string[];
  width: number;
  height: number;
  margins: Margins;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRoleDescription?: string;
  description?: string;
  ariaDescribedby?: string;
  seriesAriaRoleDescription?: (series: string) => string;
  seriesAriaLabel?: (series: string) => string;
  seriesDescription?: (series: string) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  svgRef?: Ref<SVGSVGElement>;
  transitionSeconds?: number;
  compact: boolean;
};

function HorizontalStackedBarChartCore<CategoryT extends DomainValue>({
  data,
  seriesKeys,
  colorRange,
  width,
  height,
  margins,
  ariaLabel,
  ariaLabelledby,
  ariaRoleDescription,
  description,
  ariaDescribedby,
  seriesAriaRoleDescription,
  seriesAriaLabel,
  seriesDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  svgRef,
  transitionSeconds = 0.5,
  compact
}: HorizontalStackedBarChartProps<CategoryT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins);

  const valueDomain = useContinuousDomainForSeriesData(
    data,
    seriesKeys,
    getValueListDatumSum,
    getValueListDatumSum,
    { includeZeroInDomain: true }
  );

  const valueScale = useLinearScale(valueDomain, chartArea.rangeWidth, {
    nice: true,
    rangeRound: true
  });

  const categoryDomain = useOrdinalDomain(data, (d) => d.category);
  const categoryScale = useBandScale(categoryDomain, chartArea.rangeHeightReversed, {
    paddingInner: 0.3,
    paddingOuter: 0.2,
    rangeRound: true
  });

  const seriesDomain = useOrdinalDomain<string, string>(seriesKeys);
  const seriesScale = useOrdinalScale(seriesDomain, colorRange);

  return (
    <SvgChartRoot
      ref={svgRef}
      width={width}
      height={height}
      transitionSeconds={transitionSeconds}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaRoleDescription={ariaRoleDescription}
      description={description}
      ariaDescribedby={ariaDescribedby}
      className="font-sans select-none bg-slate-800"
    >
      <SvgAxis
        scale={valueScale}
        orientation="bottom"
        chartArea={chartArea}
        tickSizeOuter={0}
        tickSizeInner={-chartArea.height}
        tickPadding={10}
        tickArguments={[compact ? 5 : 10]}
        className="text-xs"
        hideDomainPath
        tickLineClassName="text-slate-600"
        tickTextClassName="text-slate-200"
        axisLabel="X Axis Label"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelAlignment="center"
        axisLabelSpacing={34}
      />
      <SvgChartAreaGroup chartArea={chartArea} clipChartArea>
        <SvgStackedBars
          data={data}
          seriesKeys={seriesKeys}
          categoryScale={categoryScale}
          valueScale={valueScale}
          colorScale={seriesScale}
          chartArea={chartArea}
          orientation="horizontal"
          seriesAriaRoleDescription={seriesAriaRoleDescription}
          seriesAriaLabel={seriesAriaLabel}
          seriesDescription={seriesDescription}
          datumAriaRoleDescription={datumAriaRoleDescription}
          datumAriaLabel={datumAriaLabel}
          datumDescription={datumDescription}
        />
      </SvgChartAreaGroup>
      {/* This axis is rendered after the bars so that its domain sits on top of them */}
      <SvgAxis
        scale={categoryScale}
        orientation="left"
        chartArea={chartArea}
        tickSizeInner={0}
        tickSizeOuter={0}
        tickPadding={10}
        className="text-sm"
        domainClassName="text-slate-300"
        axisLabel="Y Axis Label"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelAlignment="center"
        axisLabelSpacing={44}
      />
    </SvgChartRoot>
  );
}

export const HorizontalStackedBarChart = memo(
  HorizontalStackedBarChartCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins
) as typeof HorizontalStackedBarChartCore;
