import { ReactElement } from 'react';
import Tippy from '@tippyjs/react';

import { useFollowOnHoverTooltip } from '@/tooltip';
import type { CategoryValueListDatum, DomainValue } from '@/types';

import { StackedBarChart, StackedBarChartProps } from './StackedBarChart';

export type StackedBarChartWithTooltipProps<CategoryT extends DomainValue> = Omit<
  StackedBarChartProps<CategoryT>,
  'svgRef' | 'onMouseEnter' | 'onMouseLeave' | 'onClick'
> & {
  renderTooltipContent: (datum: CategoryValueListDatum<CategoryT, number>) => ReactElement | null;
  hideOnScroll: boolean;
};

// For rendering performance, the tooltip has to be rendered separately from the
// chart.
export function StackedBarChartWithTooltip<CategoryT extends DomainValue>({
  renderTooltipContent,
  hideOnScroll,
  ...rest
}: StackedBarChartWithTooltipProps<CategoryT>): ReactElement | null {
  const [interactionProps, svgRef, tippyProps] = useFollowOnHoverTooltip(renderTooltipContent, hideOnScroll);
  return (
    <>
      <StackedBarChart svgRef={svgRef} {...rest} {...interactionProps} />
      <Tippy {...tippyProps} />
    </>
  );
}
