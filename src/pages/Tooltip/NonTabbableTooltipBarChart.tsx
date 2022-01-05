import { memo, ReactElement } from 'react';
import Tippy from '@tippyjs/react';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgBars } from '@/components/SvgBars';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { useChartArea } from '@/hooks/useChartArea';
import { useDomainContinuous } from '@/hooks/useDomainContinuous';
import { useDomainOrdinal } from '@/hooks/useDomainOrdinal';
import { useScaleBand } from '@/hooks/useScaleBand';
import { useScaleLinear } from '@/hooks/useScaleLinear';
import type { CategoryValueDatum, DomainValue, Margins } from '@/types';

import { SvgNonTabbableTooltipInteractionBars } from './SvgNonTabbableTooltipInteractionBars';
import { useNonTabbableTooltip } from './useNonTabbableTooltip';

export type NonTabbableTooltipBarChartProps<CategoryT extends DomainValue> = {
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
  datumDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  renderTooltipContent: (datum: CategoryValueDatum<CategoryT, number>) => ReactElement | null;
  transitionSeconds?: number;
  hideOnScroll: boolean;
};

function NonTabbableTooltipBarChartCore<CategoryT extends DomainValue>({
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
  renderTooltipContent,
  transitionSeconds = 0.5,
  hideOnScroll
}: NonTabbableTooltipBarChartProps<CategoryT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins);
  const valueDomain = useDomainContinuous(data, (d) => d.value, { includeZeroInDomain: true });
  const valueScale = useScaleLinear(valueDomain, chartArea.yRange, { nice: true, clamp: true });
  const categoryDomain = useDomainOrdinal(data, (d) => d.category);
  const categoryScale = useScaleBand(categoryDomain, chartArea.xRange, {
    paddingInner: 0.3,
    paddingOuter: 0.2
  });
  const [interactionProps, referenceProps, tippyProps] = useNonTabbableTooltip(
    renderTooltipContent,
    hideOnScroll
  );
  return (
    <>
      <SvgChartRoot
        {...referenceProps}
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
          className="text-blue-600"
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
          className="text-sm"
          domainClassName="text-slate-300"
          axisLabel="X Axis Label"
          axisLabelAlignment="center"
          axisLabelClassName="text-sm text-slate-300"
          axisLabelSpacing={34}
        />
        <SvgNonTabbableTooltipInteractionBars
          data={data}
          categoryScale={categoryScale}
          valueScale={valueScale}
          chartArea={chartArea}
          orientation="vertical"
          {...interactionProps}
        />
      </SvgChartRoot>
      <Tippy {...tippyProps} />
    </>
  );
}

export const NonTabbableTooltipBarChart = memo(
  NonTabbableTooltipBarChartCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins
) as typeof NonTabbableTooltipBarChartCore;
