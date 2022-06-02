import { ReactElement } from 'react';

import { useFollowOnHoverTooltip } from '@/tooltip';
import { CategoryValueListDatum, DomainValue } from '@/types';

import { StackedBarChart, StackedBarChartProps } from './StackedBarChart';

export type StackedBarChartWithTooltipProps<CategoryT extends DomainValue> = Omit<
  StackedBarChartProps<CategoryT>,
  'svgRef' | 'onMouseEnter' | 'onMouseLeave' | 'onClick'
> & {
  renderTooltipContent: (datum: CategoryValueListDatum<CategoryT, number>) => ReactElement | null;
  hideTooltipOnScroll: boolean;
};

// For rendering performance, the tooltip has to be rendered separately from the
// chart.
export function StackedBarChartWithTooltip<CategoryT extends DomainValue>({
  renderTooltipContent,
  hideTooltipOnScroll,
  ...rest
}: StackedBarChartWithTooltipProps<CategoryT>): ReactElement | null {
  const [svgRef, interactionProps, TooltipComponent, tooltipProps] = useFollowOnHoverTooltip(
    renderTooltipContent,
    { hideTooltipOnScroll, yOffset: 14 }
  );
  return (
    <>
      <StackedBarChart svgRef={svgRef} {...rest} {...interactionProps} />
      <TooltipComponent {...tooltipProps} />
    </>
  );
}
