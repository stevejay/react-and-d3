import { memo, ReactElement, RefObject } from 'react';
import { SpringConfig } from '@react-spring/web';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgCategoryInteraction } from '@/components/SvgCategoryInteraction';
import { SvgChartAreaGroup } from '@/components/SvgChartAreaGroup';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgStackedBars } from '@/components/SvgStackedBars';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomainForSeriesData } from '@/hooks/useContinuousDomainForSeriesData';
import { useLinearScale } from '@/hooks/useLinearScale';
import { useOrdinalDomain } from '@/hooks/useOrdinalDomain';
import type { CategoryValueListDatum, DomainValue, Margins, Rect } from '@/types';
import { getValueListDatumSum } from '@/utils/dataUtils';

export type StackedBarChartProps<CategoryT extends DomainValue> = {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  seriesKeys: readonly string[];
  seriesColor: (series: string, index: number) => string;
  width: number;
  height: number;
  margins: Margins;
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
  svgRef: RefObject<SVGSVGElement>;
  compact: boolean;
  onMouseEnter: (datum: CategoryValueListDatum<CategoryT, number>, rect: Rect) => void;
  onMouseLeave: () => void;
  onClick: (datum: CategoryValueListDatum<CategoryT, number>, rect: Rect) => void;
  springConfig: SpringConfig;
};

function StackedBarChartCore<CategoryT extends DomainValue>({
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
  compact,
  onMouseEnter,
  onMouseLeave,
  onClick,
  springConfig
}: StackedBarChartProps<CategoryT>): ReactElement | null {
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
        axisLabel="Y Axis Label"
        axisLabelAlignment="center"
        axisLabelClassName="text-sm text-slate-300"
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
      {/* X-axis is rendered after the bars so that its domain sits on top of them */}
      <SvgAxis
        scale={categoryScale}
        chartArea={chartArea}
        orientation="left"
        tickSizeInner={0}
        tickSizeOuter={0}
        tickPadding={10}
        className="text-sm"
        domainClassName="text-slate-300"
        axisLabel="X Axis Label"
        axisLabelAlignment="center"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelSpacing={44}
        springConfig={springConfig}
      />
      <SvgCategoryInteraction
        svgRef={svgRef}
        data={data}
        categoryScale={categoryScale}
        chartArea={chartArea}
        orientation="horizontal"
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
