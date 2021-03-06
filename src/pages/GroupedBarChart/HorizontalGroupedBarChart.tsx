import { memo, ReactElement, Ref } from 'react';
import { SpringConfig } from 'react-spring';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgChartAreaGroup } from '@/components/SvgChartAreaGroup';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgGroupedBars } from '@/components/SvgGroupedBars';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomainForSeriesData } from '@/hooks/useContinuousDomainForSeriesData';
import { useLinearScale } from '@/hooks/useLinearScale';
import { useOrdinalDomain } from '@/hooks/useOrdinalDomain';
import { CategoryValueListDatum, DomainValue, Margin } from '@/types';
import { getValueListDatumMaxValue, getValueListDatumMinValue } from '@/utils/dataUtils';

export interface HorizontalGroupedBarChartProps<CategoryT extends DomainValue> {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  seriesKeys: readonly string[];
  seriesColor: (series: string) => string;
  width: number;
  height: number;
  margins: Margin;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRoleDescription?: string;
  description?: string;
  ariaDescribedby?: string;
  categoryAriaRoleDescription?: (category: CategoryT) => string;
  categoryAriaLabel?: (category: CategoryT) => string;
  categoryDescription?: (category: CategoryT) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  svgRef?: Ref<SVGSVGElement>;
  springConfig: SpringConfig;
  compact: boolean;
}

function HorizontalGroupedBarChartCore<CategoryT extends DomainValue>({
  data,
  seriesKeys,
  seriesColor,
  width,
  height,
  margins,
  ariaLabel,
  ariaLabelledby,
  ariaRoleDescription,
  description,
  ariaDescribedby,
  categoryAriaRoleDescription,
  categoryAriaLabel,
  categoryDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  svgRef,
  springConfig,
  compact
}: HorizontalGroupedBarChartProps<CategoryT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins);

  const valueDomain = useContinuousDomainForSeriesData(
    data,
    seriesKeys,
    getValueListDatumMinValue,
    getValueListDatumMaxValue,
    { includeZeroInDomain: true }
  );

  const xScale = useLinearScale(valueDomain, chartArea.rangeWidth, {
    nice: true,
    rangeRound: true
  });

  const categoryDomain = useOrdinalDomain(data, (datum) => datum.category);
  const y0Scale = useBandScale(categoryDomain, chartArea.rangeHeightReversed, {
    paddingInner: 0.1,
    rangeRound: true
  });

  const seriesDomain = useOrdinalDomain<string, string>(seriesKeys);
  const y1Scale = useBandScale(seriesDomain, [0, y0Scale.bandwidth()], {
    paddingInner: 0.05,
    paddingOuter: 0.05,
    rangeRound: true
  });

  return (
    <SvgChartRoot
      ref={svgRef}
      width={width}
      height={height}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaRoleDescription={ariaRoleDescription}
      description={description}
      ariaDescribedby={ariaDescribedby}
      className="font-sans select-none bg-slate-800"
    >
      <SvgAxis
        scale={xScale}
        chartArea={chartArea}
        orientation="bottom"
        tickSizeOuter={0}
        tickSizeInner={-chartArea.height}
        tickPadding={10}
        tickArguments={[compact ? 5 : 10]}
        className="text-xs"
        hideDomainPath
        tickLineClassName="text-slate-600"
        tickTextClassName="text-slate-200"
        axisLabel="X Axis Label"
        axisLabelAlignment="center"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelSpacing={34}
        springConfig={springConfig}
      />
      <SvgChartAreaGroup chartArea={chartArea} clipChartArea>
        <SvgGroupedBars
          data={data}
          seriesKeys={seriesKeys}
          seriesColor={seriesColor}
          categoryScale={y0Scale}
          seriesScale={y1Scale}
          valueScale={xScale}
          chartArea={chartArea}
          orientation="horizontal"
          categoryAriaRoleDescription={categoryAriaRoleDescription}
          categoryAriaLabel={categoryAriaLabel}
          categoryDescription={categoryDescription}
          datumAriaRoleDescription={datumAriaRoleDescription}
          datumAriaLabel={datumAriaLabel}
          datumDescription={datumDescription}
          springConfig={springConfig}
        />
      </SvgChartAreaGroup>
      {/* X-axis is rendered after the bars so that its domain sits on top of them */}
      <SvgAxis
        scale={y0Scale}
        chartArea={chartArea}
        orientation="left"
        tickSizeInner={0}
        tickSizeOuter={0}
        tickPadding={10}
        className="text-sm"
        domainClassName="text-slate-300"
        axisLabel="Y Axis Label"
        axisLabelAlignment="center"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelSpacing={44}
        springConfig={springConfig}
      />
    </SvgChartRoot>
  );
}

export const HorizontalGroupedBarChart = memo(
  HorizontalGroupedBarChartCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins
) as typeof HorizontalGroupedBarChartCore;
