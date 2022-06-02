import { memo, ReactElement, Ref } from 'react';
import { SpringConfig } from 'react-spring';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgChartAreaGroup } from '@/components/SvgChartAreaGroup';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgStackedBars } from '@/components/SvgStackedBars';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomainForSeriesData } from '@/hooks/useContinuousDomainForSeriesData';
import { useLinearScale } from '@/hooks/useLinearScale';
import { useOrdinalDomain } from '@/hooks/useOrdinalDomain';
import { CategoryValueListDatum, DomainValue, Margin } from '@/types';
import { getValueListDatumSum } from '@/utils/dataUtils';

export interface HorizontalStackedBarChartProps<CategoryT extends DomainValue> {
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
  isCompact: (width: number) => boolean;
}

function HorizontalStackedBarChartCore<CategoryT extends DomainValue>({
  data,
  seriesKeys,
  seriesColor,
  width = 0,
  height = 0,
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
  isCompact
}: HorizontalStackedBarChartProps<CategoryT>): ReactElement | null {
  const compact = isCompact(width);
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

  const categoryDomain = useOrdinalDomain(data, (datum) => datum.category);
  const categoryScale = useBandScale(categoryDomain, chartArea.rangeHeightReversed, {
    paddingInner: 0.3,
    paddingOuter: 0.2,
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
        springConfig={springConfig}
      />
      <SvgChartAreaGroup chartArea={chartArea} clipChartArea>
        <SvgStackedBars
          data={data}
          seriesKeys={seriesKeys}
          seriesColor={seriesColor}
          categoryScale={categoryScale}
          valueScale={valueScale}
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
        springConfig={springConfig}
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
