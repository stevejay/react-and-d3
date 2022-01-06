import { ReactElement } from 'react';
import Tippy from '@tippyjs/react';

import type { CategoryValueListDatum, DomainValue } from '@/types';

import { useFollowOnHoverTooltip } from './useFollowOnHoverTooltip';
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
  const [interactionProps, svgRef, tippyProps] = useFollowOnHoverTooltip(renderTooltipContent, hideOnScroll);
  return (
    <>
      <VerticalStackedBarChart svgRef={svgRef} {...rest} {...interactionProps} />
      <Tippy {...tippyProps} />
    </>
  );
}
