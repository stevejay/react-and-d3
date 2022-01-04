import { memo, ReactElement, Ref } from 'react';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgBars } from '@/components/SvgBars';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomain } from '@/hooks/useContinuousDomain';
import { useLinearScale } from '@/hooks/useLinearScale';
import { useOrdinalDomain } from '@/hooks/useOrdinalDomain';
import type { CategoryValueDatum, DomainValue, Margins } from '@/types';

export type VerticalBarChartProps<CategoryT extends DomainValue> = {
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

function VerticalBarChartCore<CategoryT extends DomainValue>({
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
}: VerticalBarChartProps<CategoryT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins);
  const valueDomain = useContinuousDomain(data, (d) => d.value, { includeZeroInDomain: true });
  const valueScale = useLinearScale(valueDomain, chartArea.yRange, { nice: true, clamp: true });
  const categoryDomain = useOrdinalDomain(data, (d) => d.category);
  const categoryScale = useBandScale(categoryDomain, chartArea.xRange, {
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
        chartArea={chartArea}
        orientation="left"
        tickSizeOuter={0}
        tickSizeInner={-chartArea.width}
        tickPadding={10}
        className="text-xs"
        hideDomainPath
        tickLineClassName="text-slate-600"
        tickTextClassName="text-slate-200"
        axisLabel="Y Axis Label"
        axisLabelAlignment="center"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelSpacing={53}
      />
      <SvgBars
        data={data}
        categoryScale={categoryScale}
        valueScale={valueScale}
        chartArea={chartArea}
        orientation="vertical"
        className="text-slate-600"
        datumAriaRoleDescription={datumAriaRoleDescription}
        datumAriaLabel={datumAriaLabel}
        datumAriaDescription={datumAriaDescription}
      />
      {/* X-axis is rendered after the bars so that its domain sits on top of them */}
      <SvgAxis
        scale={categoryScale}
        chartArea={chartArea}
        orientation="bottom"
        tickSizeInner={0}
        tickSizeOuter={0}
        tickPadding={10}
        className="text-sm"
        domainClassName="text-slate-300"
        axisLabel="X Axis Label"
        axisLabelAlignment="center"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelSpacing={34}
      />
    </SvgChartRoot>
  );
}

export const VerticalBarChart = memo(
  VerticalBarChartCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins
) as typeof VerticalBarChartCore;
