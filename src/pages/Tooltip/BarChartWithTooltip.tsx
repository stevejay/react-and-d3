import { ReactElement } from 'react';

import { useFollowOnHoverTooltip } from '@/tooltip';
import { CategoryValueDatum, DomainValue } from '@/types';

import { BarChart, BarChartProps } from './BarChart';

export type BarChartWithTooltipProps<CategoryT extends DomainValue> = Omit<
  BarChartProps<CategoryT>,
  'svgRef' | 'onMouseEnter' | 'onMouseLeave' | 'onClick'
> & {
  renderTooltipContent: (datum: CategoryValueDatum<CategoryT, number>) => ReactElement | null;
  hideTooltipOnScroll: boolean;
};

// For rendering performance, the tooltip has to be rendered separately from the
// chart.
export function BarChartWithTooltip<CategoryT extends DomainValue>({
  renderTooltipContent,
  hideTooltipOnScroll,
  ...rest
}: BarChartWithTooltipProps<CategoryT>): ReactElement | null {
  const [svgRef, interactionProps, TooltipComponent, tooltipProps] = useFollowOnHoverTooltip(
    renderTooltipContent,
    { hideTooltipOnScroll }
  );
  return (
    <>
      <BarChart svgRef={svgRef} {...rest} {...interactionProps} />
      <TooltipComponent {...tooltipProps} />
    </>
  );
}
