import { ReactElement } from 'react';
import type { AxisDomain } from 'd3';

import { SvgAxis } from '@/SvgAxis';
import { SvgAxisLabel } from '@/SvgAxisLabel';
import { SvgBars } from '@/SvgBars';
import { SvgChartRoot } from '@/SvgChartRoot';
import type { CategoryValueDatum, Margins } from '@/types';
import { useBandScale } from '@/useBandScale';
import { useChartArea } from '@/useChartArea';
import { useContinuousDomain } from '@/useContinuousDomain';
import { useLinearScale } from '@/useLinearScale';
import { useOrdinalDomain } from '@/useOrdinalDomain';

type VerticalBarChartProps<CategoryT extends AxisDomain> = {
  data: CategoryValueDatum<CategoryT, number>[];
  width: number;
  height: number;
  margins: Margins;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescription?: string;
  ariaDescribedby?: string;
};

export function VerticalBarChart<CategoryT extends AxisDomain>({
  data,
  width,
  height,
  margins,
  ariaLabel,
  ariaLabelledby,
  ariaDescription,
  ariaDescribedby
}: VerticalBarChartProps<CategoryT>): ReactElement<any, any> | null {
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
      width={width}
      height={height}
      durationSecs={0.5}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaDescription={ariaDescription}
      ariaDescribedby={ariaDescribedby}
      className="font-sans select-none bg-slate-800"
    >
      <SvgAxis
        scale={valueScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY}
        orientation="left"
        tickSizeOuter={0}
        tickSizeInner={-chartArea.width}
        tickPadding={10}
        className="text-xs"
        domainClassName="text-transparent"
        tickLineClassName="text-slate-600"
        tickTextClassName="text-slate-200"
      />
      <SvgAxisLabel
        label="Y Axis Label"
        chartArea={chartArea}
        offset={48}
        orientation="left"
        align="center"
        className="text-sm text-slate-400"
      />
      <SvgAxis
        scale={categoryScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY + chartArea.height}
        orientation="bottom"
        tickSizeInner={0}
        tickPadding={10}
        className="text-sm"
        domainClassName="text-slate-400"
      />
      <SvgAxisLabel
        label="X Axis Label"
        chartArea={chartArea}
        offset={32}
        orientation="bottom"
        align="center"
        className="text-sm text-slate-400"
      />
      <SvgBars
        data={data}
        categoryScale={categoryScale}
        valueScale={valueScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY}
        chartWidth={chartArea.width}
        chartHeight={chartArea.height}
        orientation="vertical"
        className="text-slate-600"
      />
    </SvgChartRoot>
  );
}
