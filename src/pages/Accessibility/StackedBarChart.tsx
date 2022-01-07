import { memo, ReactElement, RefObject } from 'react';

import { SvgAxis, SvgAxisProps } from '@/components/SvgAxis';
import { SvgCategoryInteraction } from '@/components/SvgCategoryInteraction';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgStackedBars } from '@/components/SvgStackedBars';
import { useChartArea } from '@/hooks/useChartArea';
import { useDomainContinuous } from '@/hooks/useDomainContinuous';
import { useDomainOrdinal } from '@/hooks/useDomainOrdinal';
import { useScaleBand } from '@/hooks/useScaleBand';
import { useScaleLinear } from '@/hooks/useScaleLinear';
import { useScaleOrdinal } from '@/hooks/useScaleOrdinal';
import type { CategoryValueListDatum, DomainValue, Margins, Rect } from '@/types';
import { getSumOfValues } from '@/utils/dataUtils';

export type StackedBarChartProps<CategoryT extends DomainValue> = {
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
  independentAxisLabel?: string;
  independentAxisTickFormat?: SvgAxisProps<CategoryT>['tickFormat'];
  dependentAxisLabel?: string;
  seriesAriaRoleDescription?: (series: string) => string;
  seriesAriaLabel?: (series: string) => string;
  seriesDescription?: (series: string) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  transitionSeconds?: number;
  svgRef: RefObject<SVGSVGElement>;
  onMouseEnter: (datum: CategoryValueListDatum<CategoryT, number>, rect: Rect) => void;
  onMouseLeave: () => void;
  onClick: (datum: CategoryValueListDatum<CategoryT, number>, rect: Rect) => void;
};

function StackedBarChartCore<CategoryT extends DomainValue>({
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
  independentAxisLabel,
  independentAxisTickFormat,
  dependentAxisLabel,
  seriesAriaRoleDescription,
  seriesAriaLabel,
  seriesDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  transitionSeconds = 0.5,
  svgRef,
  onMouseEnter,
  onMouseLeave,
  onClick
}: StackedBarChartProps<CategoryT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins);

  const valueDomain = useDomainContinuous(data, getSumOfValues, { includeZeroInDomain: true });
  const valueScale = useScaleLinear(valueDomain, chartArea.yRange, {
    nice: true,
    rangeRound: true
  });

  const categoryDomain = useDomainOrdinal(data, (d) => d.category);
  const categoryScale = useScaleBand(categoryDomain, chartArea.xRange, {
    paddingInner: 0.3,
    paddingOuter: 0.2,
    rangeRound: true
  });

  const seriesDomain = useDomainOrdinal<string, string>(seriesKeys);
  const seriesScale = useScaleOrdinal(seriesDomain, colorRange);

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
        chartArea={chartArea}
        orientation="left"
        tickSizeOuter={0}
        tickSizeInner={-chartArea.width}
        tickPadding={10}
        className="text-xs"
        hideDomainPath
        tickLineClassName="text-slate-600"
        tickTextClassName="text-slate-200"
        axisLabel={dependentAxisLabel}
        axisLabelAlignment="center"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelSpacing={53}
      />
      <SvgStackedBars
        data={data}
        seriesKeys={seriesKeys}
        categoryScale={categoryScale}
        valueScale={valueScale}
        colorScale={seriesScale}
        chartArea={chartArea}
        orientation="vertical"
        seriesAriaRoleDescription={seriesAriaRoleDescription}
        seriesAriaLabel={seriesAriaLabel}
        seriesDescription={seriesDescription}
        datumAriaRoleDescription={datumAriaRoleDescription}
        datumAriaLabel={datumAriaLabel}
        datumDescription={datumDescription}
      />
      {/* X-axis is rendered after the bars so that its domain sits on top of them */}
      <SvgAxis
        scale={categoryScale}
        chartArea={chartArea}
        orientation="bottom"
        tickSizeInner={0}
        tickSizeOuter={0}
        tickPadding={10}
        className="text-xs"
        domainClassName="text-slate-300"
        axisLabel={independentAxisLabel}
        axisLabelAlignment="center"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelSpacing={34}
        tickFormat={independentAxisTickFormat}
      />
      <SvgCategoryInteraction
        svgRef={svgRef}
        data={data}
        categoryScale={categoryScale}
        chartArea={chartArea}
        orientation="vertical"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
    </SvgChartRoot>
  );
}

export const StackedBarChart = memo(
  StackedBarChartCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins
) as typeof StackedBarChartCore;