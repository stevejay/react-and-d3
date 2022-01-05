import { memo, ReactElement, Ref } from 'react';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgStackedBars } from '@/components/SvgStackedBars';
import { useChartArea } from '@/hooks/useChartArea';
import { useDomainContinuous } from '@/hooks/useDomainContinuous';
import { useDomainOrdinal } from '@/hooks/useDomainOrdinal';
import { useScaleBand } from '@/hooks/useScaleBand';
import { useScaleLinear } from '@/hooks/useScaleLinear';
import { useScaleOrdinal } from '@/hooks/useScaleOrdinal';
import type { CategoryValueListDatum, DomainValue, Margins } from '@/types';

function getValuesTotal<CategoryT extends DomainValue>(datum: CategoryValueListDatum<CategoryT, number>) {
  let sum = 0;
  for (let property in datum.values) {
    sum += datum.values[property];
  }
  return sum;
}

export type HorizontalStackedBarChartProps<CategoryT extends DomainValue> = {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  subCategories: readonly string[];
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
};

function HorizontalStackedBarChartCore<CategoryT extends DomainValue>({
  data,
  subCategories,
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
  transitionSeconds = 0.5
}: HorizontalStackedBarChartProps<CategoryT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins);

  const valueDomain = useDomainContinuous(data, (d) => getValuesTotal(d), { includeZeroInDomain: true });
  const valueScale = useScaleLinear(valueDomain, chartArea.xRange, {
    nice: true,
    rangeRound: true
  });

  const categoryDomain = useDomainOrdinal(data, (d) => d.category);
  const categoryScale = useScaleBand(categoryDomain, chartArea.yRangeReversed, {
    paddingInner: 0.3,
    paddingOuter: 0.2,
    rangeRound: true
  });

  const subCategoryDomain = useDomainOrdinal<string, string>(subCategories);
  const subCategoryScale = useScaleOrdinal(subCategoryDomain, colorRange);

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
        className="text-xs"
        hideDomainPath
        tickLineClassName="text-slate-600"
        tickTextClassName="text-slate-200"
        axisLabel="X Axis Label"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelAlignment="center"
        axisLabelSpacing={34}
      />
      <SvgStackedBars
        data={data}
        subCategories={subCategories}
        categoryScale={categoryScale}
        valueScale={valueScale}
        colorScale={subCategoryScale}
        chartArea={chartArea}
        orientation="horizontal"
        seriesAriaRoleDescription={seriesAriaRoleDescription}
        seriesAriaLabel={seriesAriaLabel}
        seriesDescription={seriesDescription}
        datumAriaRoleDescription={datumAriaRoleDescription}
        datumAriaLabel={datumAriaLabel}
        datumDescription={datumDescription}
      />
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
