import { ReactElement } from 'react';

import { useFollowOnHoverTooltip } from '@/tooltip';
import type { CategoryValueDatum, DomainValue } from '@/types';

import { RadarChart, RadarChartProps } from './RadarChart';

export type RadarChartWithTooltipProps<CategoryT extends DomainValue> = Omit<
  RadarChartProps<CategoryT>,
  'svgRef' | 'onMouseEnter' | 'onMouseLeave' | 'onClick'
> & {
  renderTooltipContent: (datum: CategoryValueDatum<CategoryT, number>) => ReactElement | null;
  hideOnScroll: boolean;
};

// For rendering performance, the tooltip has to be rendered separately from the
// chart.
export function RadarChartWithTooltip<CategoryT extends DomainValue>({
  renderTooltipContent,
  hideOnScroll,
  ...rest
}: RadarChartWithTooltipProps<CategoryT>): ReactElement | null {
  const [svgRef, interactionProps, TooltipComponent, tooltipProps] = useFollowOnHoverTooltip(
    renderTooltipContent,
    hideOnScroll
  );
  return (
    <>
      <RadarChart svgRef={svgRef} {...rest} {...interactionProps} />
      <TooltipComponent {...tooltipProps} />
    </>
  );
}
