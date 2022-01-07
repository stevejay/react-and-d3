import { ReactElement } from 'react';

import { useFollowOnHoverTooltip } from '@/tooltip';
import type { CategoryValueListDatum, DomainValue } from '@/types';

import { VerticalStackedBarChart, VerticalStackedBarChartProps } from './VerticalStackedBarChart';

export type VerticalStackedBarChartWithTooltipProps<CategoryT extends DomainValue> = Omit<
  VerticalStackedBarChartProps<CategoryT>,
  'svgRef' | 'onMouseEnter' | 'onMouseLeave' | 'onClick'
> & {
  renderTooltipContent: (datum: CategoryValueListDatum<CategoryT, number>) => ReactElement | null;
  hideOnScroll: boolean;
};

export function VerticalStackedBarChartWithTooltip<CategoryT extends DomainValue>({
  renderTooltipContent,
  hideOnScroll,
  ...rest
}: VerticalStackedBarChartWithTooltipProps<CategoryT>): ReactElement | null {
  const [svgRef, interactionProps, TooltipComponent, tooltipProps] = useFollowOnHoverTooltip(
    renderTooltipContent,
    hideOnScroll
  );
  return (
    <>
      <VerticalStackedBarChart svgRef={svgRef} {...rest} {...interactionProps} />
      <TooltipComponent {...tooltipProps} />
    </>
  );
}
