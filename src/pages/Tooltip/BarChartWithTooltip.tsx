import { ReactElement } from 'react';
import Tippy from '@tippyjs/react';

import { useFollowOnHoverTooltip } from '@/tooltip';
import type { CategoryValueDatum, DomainValue } from '@/types';

import { BarChart, BarChartProps } from './BarChart';

export type BarChartWithTooltipProps<CategoryT extends DomainValue> = Omit<
  BarChartProps<CategoryT>,
  'svgRef' | 'onMouseEnter' | 'onMouseLeave' | 'onClick'
> & {
  renderTooltipContent: (datum: CategoryValueDatum<CategoryT, number>) => ReactElement | null;
  hideOnScroll: boolean;
};

// For rendering performance, the tooltip has to be rendered separately from the
// chart.
export function BarChartWithTooltip<CategoryT extends DomainValue>({
  renderTooltipContent,
  hideOnScroll,
  ...rest
}: BarChartWithTooltipProps<CategoryT>): ReactElement | null {
  const [interactionProps, svgRef, tippyProps] = useFollowOnHoverTooltip(renderTooltipContent, hideOnScroll);
  return (
    <>
      <BarChart svgRef={svgRef} {...rest} {...interactionProps} />
      <Tippy {...tippyProps} />
    </>
  );
}
