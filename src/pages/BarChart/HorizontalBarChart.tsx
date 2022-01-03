import { memo, ReactElement, Ref } from 'react';
import type { AxisDomain } from 'd3-axis';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgAxisLabel } from '@/components/SvgAxisLabel';
import { SvgBars } from '@/components/SvgBars';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgInteractionBars } from '@/components/SvgInteractionBars';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomain } from '@/hooks/useContinuousDomain';
import { useLinearScale } from '@/hooks/useLinearScale';
import { useOrdinalDomain } from '@/hooks/useOrdinalDomain';
import type { CategoryValueDatum, Margins } from '@/types';

export type HorizontalBarChartProps<CategoryT extends AxisDomain> = {
  data: CategoryValueDatum<CategoryT, number>[];
  width: number;
  height: number;
  margins: Margins;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRoleDescription?: string;
  description?: string;
  ariaDescribedby?: string;
  datumAriaRoleDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumAriaLabel?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumAriaDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  svgRef?: Ref<SVGSVGElement>;
  transitionSeconds?: number;
};

function HorizontalBarChartCore<CategoryT extends AxisDomain>({
  data,
  width,
  height,
  margins,
  ariaLabel,
  ariaLabelledby,
  ariaRoleDescription,
  description,
  ariaDescribedby,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumAriaDescription,
  svgRef,
  transitionSeconds = 0.5
}: HorizontalBarChartProps<CategoryT>): ReactElement<any, any> | null {
  const chartArea = useChartArea(width, height, margins);
  const valueDomain = useContinuousDomain(data, (d) => d.value, { includeZeroInDomain: true });
  const valueScale = useLinearScale(valueDomain, chartArea.xRange, { nice: true, clamp: true });
  const categoryDomain = useOrdinalDomain(data, (d) => d.category);
  const categoryScale = useBandScale(categoryDomain, chartArea.yRangeReversed, {
    paddingInner: 0.3,
    paddingOuter: 0.2
  });
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
      <SvgBars
        data={data}
        categoryScale={categoryScale}
        valueScale={valueScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY}
        chartWidth={chartArea.width}
        chartHeight={chartArea.height}
        orientation="horizontal"
        className="text-slate-600"
        datumAriaRoleDescription={datumAriaRoleDescription}
        datumAriaLabel={datumAriaLabel}
        datumAriaDescription={datumAriaDescription}
      />
      {/* Y-axis is rendered after the bars so that its domain sits on top of them */}
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
      <SvgInteractionBars
        data={data}
        categoryScale={categoryScale}
        valueScale={valueScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY}
        chartWidth={chartArea.width}
        chartHeight={chartArea.height}
        orientation="horizontal"
      />
    </SvgChartRoot>
  );
}

export const HorizontalBarChart = memo(
  HorizontalBarChartCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins
) as typeof HorizontalBarChartCore;
