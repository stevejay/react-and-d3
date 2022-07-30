import { memo, ReactElement, RefObject } from 'react';
import type { SpringConfig } from 'react-spring';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgBars } from '@/components/SvgBars';
import { SvgCategoryInteraction } from '@/components/SvgCategoryInteraction';
import { SvgChartAreaGroup } from '@/components/SvgChartAreaGroup';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomain } from '@/hooks/useContinuousDomain';
import { useLinearScale } from '@/hooks/useLinearScale';
import { useOrdinalDomain } from '@/hooks/useOrdinalDomain';
import { CategoryValueDatum, DomainValue, Margin, Rect } from '@/types';

export interface BarChartProps<CategoryT extends DomainValue> {
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
  transitionSeconds?: number;
  svgRef: RefObject<SVGSVGElement>;
  onMouseMove: (datum: CategoryValueDatum<CategoryT, number>, rect: Rect) => void;
  onMouseLeave: () => void;
  onClick: (datum: CategoryValueDatum<CategoryT, number>, rect: Rect) => void;
  springConfig: SpringConfig;
}

function BarChartCore<CategoryT extends DomainValue>({
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
  onMouseMove,
  onMouseLeave,
  onClick,
  springConfig
}: BarChartProps<CategoryT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins);
  const valueDomain = useContinuousDomain(data, (datum) => datum.value, { includeZeroInDomain: true });
  const valueScale = useLinearScale(valueDomain, chartArea.rangeHeight, { nice: true });
  const categoryDomain = useOrdinalDomain(data, (datum) => datum.category);
  const categoryScale = useBandScale(categoryDomain, chartArea.rangeWidth, {
    paddingInner: 0.3,
    paddingOuter: 0.2
  });
  return (
    <>
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
          springConfig={springConfig}
        />
        <SvgChartAreaGroup chartArea={chartArea} clipChartArea>
          <SvgBars
            data={data}
            categoryScale={categoryScale}
            valueScale={valueScale}
            orientation="vertical"
            className="fill-sky-500"
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
          springConfig={springConfig}
        />
        <SvgCategoryInteraction
          svgRef={svgRef}
          data={data}
          categoryScale={categoryScale}
          chartArea={chartArea}
          orientation="vertical"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
        />
      </SvgChartRoot>
    </>
  );
}

export const BarChart = memo(
  BarChartCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins
) as typeof BarChartCore;
