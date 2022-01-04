import { memo, ReactElement, Ref } from 'react';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgAxisLabel } from '@/components/SvgAxisLabel';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgStackedBars } from '@/components/SvgStackedBars';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomain } from '@/hooks/useContinuousDomain';
import { useLinearScale } from '@/hooks/useLinearScale';
import { useOrdinalDomain } from '@/hooks/useOrdinalDomain';
import { useOrdinalScale } from '@/hooks/useOrdinalScale';
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
  seriesAriaDescription?: (series: string) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
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
  seriesAriaDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumAriaDescription,
  svgRef,
  transitionSeconds = 0.5
}: HorizontalStackedBarChartProps<CategoryT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins);

  const valueDomain = useContinuousDomain(data, (d) => getValuesTotal(d), { includeZeroInDomain: true });
  const valueScale = useLinearScale(valueDomain, chartArea.xRange, {
    nice: true,
    rangeRound: true
  });

  const categoryDomain = useOrdinalDomain(data, (d) => d.category);
  const categoryScale = useBandScale(categoryDomain, chartArea.yRangeReversed, {
    paddingInner: 0.3,
    paddingOuter: 0.2,
    rangeRound: true
  });

  const subCategoryDomain = useOrdinalDomain<string, string>(subCategories);
  const subCategoryScale = useOrdinalScale(subCategoryDomain, colorRange);

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
        translateX={chartArea.translateX}
        translateY={chartArea.translateY + chartArea.height}
        orientation="bottom"
        tickSizeOuter={0}
        tickSizeInner={-chartArea.height}
        tickPadding={10}
        className="text-xs"
        domainClassName="text-transparent"
        tickLineClassName="text-slate-600"
        tickTextClassName="text-slate-200"
      />
      <SvgAxisLabel
        label="X Axis Label"
        chartArea={chartArea}
        offset={32}
        orientation="bottom"
        align="center"
        className="text-sm text-slate-300"
      />
      <SvgStackedBars
        data={data}
        subCategories={subCategories}
        categoryScale={categoryScale}
        valueScale={valueScale}
        colorScale={subCategoryScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY}
        chartWidth={chartArea.width}
        chartHeight={chartArea.height}
        orientation="horizontal"
        seriesAriaRoleDescription={seriesAriaRoleDescription}
        seriesAriaLabel={seriesAriaLabel}
        seriesAriaDescription={seriesAriaDescription}
        datumAriaRoleDescription={datumAriaRoleDescription}
        datumAriaLabel={datumAriaLabel}
        datumAriaDescription={datumAriaDescription}
      />
      {/* This axis is rendered after the bars so that its domain sits on top of them */}
      <SvgAxis
        scale={categoryScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY}
        orientation="left"
        tickSizeInner={0}
        tickSizeOuter={0}
        tickPadding={10}
        className="text-sm"
        domainClassName="text-slate-300"
      />
      <SvgAxisLabel
        label="Y Axis Label"
        chartArea={chartArea}
        offset={40}
        orientation="left"
        align="center"
        className="text-sm text-slate-300"
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