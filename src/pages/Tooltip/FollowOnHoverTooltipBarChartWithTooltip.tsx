import { ReactElement } from 'react';
import Tippy from '@tippyjs/react';

import type { CategoryValueDatum, DomainValue } from '@/types';

import {
  FollowOnHoverTooltipBarChart,
  FollowOnHoverTooltipBarChartProps
} from './FollowOnHoverTooltipBarChart';
import { useFollowOnHoverTooltip } from './useFollowOnHoverTooltip';

export type FollowOnHoverTooltipBarChartWithTooltipProps<CategoryT extends DomainValue> = Omit<
  FollowOnHoverTooltipBarChartProps<CategoryT>,
  'svgRef' | 'onMouseEnter' | 'onMouseLeave' | 'onClick'
> & {
  renderTooltipContent: (datum: CategoryValueDatum<CategoryT, number>) => ReactElement | null;
  hideOnScroll: boolean;
};

export function FollowOnHoverTooltipBarChartWithTooltip<CategoryT extends DomainValue>({
  renderTooltipContent,
  hideOnScroll,
  ...rest
}: FollowOnHoverTooltipBarChartWithTooltipProps<CategoryT>): ReactElement | null {
  const [interactionProps, svgRef, tippyProps] = useFollowOnHoverTooltip(renderTooltipContent, hideOnScroll);
  return (
    <>
      <FollowOnHoverTooltipBarChart svgRef={svgRef} {...rest} {...interactionProps} />
      <Tippy {...tippyProps} />
    </>
  );
}
