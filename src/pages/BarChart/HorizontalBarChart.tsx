import { memo, ReactElement, Ref } from 'react';
import type { SpringConfig } from 'react-spring';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgBars } from '@/components/SvgBars';
import { SvgChartAreaGroup } from '@/components/SvgChartAreaGroup';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgLineAnnotation } from '@/components/SvgLineAnnotation';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomain } from '@/hooks/useContinuousDomain';
import { useLinearScale } from '@/hooks/useLinearScale';
import { useOrdinalDomain } from '@/hooks/useOrdinalDomain';
import { CategoryValueDatum, DomainValue, Margin } from '@/types';

export interface HorizontalBarChartProps<CategoryT extends DomainValue> {
  data: CategoryValueDatum<CategoryT, number>[];
  width: number;
  height: number;
  margins: Margin;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRoleDescription?: string;
  description?: string;
  ariaDescribedby?: string;
  datumAriaRoleDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumAriaLabel?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  svgRef?: Ref<SVGSVGElement>;
  springConfig: SpringConfig;
  compact: boolean;
}

function HorizontalBarChartCore<CategoryT extends DomainValue>({
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
  datumDescription,
  svgRef,
  springConfig,
  compact
}: HorizontalBarChartProps<CategoryT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins);
  const valueDomain = useContinuousDomain(data, (datum) => datum.value, { includeZeroInDomain: true });
  const valueScale = useLinearScale(valueDomain, chartArea.rangeWidth, { nice: true, clamp: true });
  const categoryDomain = useOrdinalDomain(data, (datum) => datum.category);
  const categoryScale = useBandScale(categoryDomain, chartArea.rangeHeightReversed, {
    paddingInner: 0.3,
    paddingOuter: 0.2
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
        hideDomainPath
        className="text-xs"
        tickLineClassName="text-slate-600"
        tickTextClassName="text-slate-200"
        axisLabel="X Axis Label"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelAlignment="center"
        axisLabelSpacing={34}
        springConfig={springConfig}
      />
      <SvgAxis
        scale={categoryScale}
        chartArea={chartArea}
        orientation="left"
        tickSizeInner={0}
        tickSizeOuter={0}
        tickPadding={10}
        className="text-sm"
        hideDomainPath
        axisLabel="Y Axis Label"
        axisLabelClassName="text-sm text-slate-300"
        axisLabelAlignment="center"
        axisLabelSpacing={44}
        springConfig={springConfig}
      />
      <SvgChartAreaGroup chartArea={chartArea} clipChartArea>
        <SvgBars
          data={data}
          categoryScale={categoryScale}
          valueScale={valueScale}
          orientation="horizontal"
          className="text-sky-500"
          datumAriaRoleDescription={datumAriaRoleDescription}
          datumAriaLabel={datumAriaLabel}
          datumDescription={datumDescription}
          springConfig={springConfig}
        />
        <SvgLineAnnotation
          orientation="vertical"
          value={0}
          scale={valueScale}
          chartArea={chartArea}
          className="text-slate-300"
          springConfig={springConfig}
        />
      </SvgChartAreaGroup>
    </SvgChartRoot>
  );
}

export const HorizontalBarChart = memo(
  HorizontalBarChartCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins &&
    prevProps.springConfig === nextProps.springConfig
) as typeof HorizontalBarChartCore;
