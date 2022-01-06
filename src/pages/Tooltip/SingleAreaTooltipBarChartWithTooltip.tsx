import { ReactElement } from 'react';
import Tippy from '@tippyjs/react';

import type { CategoryValueDatum, DomainValue, Margins } from '@/types';

import { SingleAreaTooltipBarChart } from './SingleAreaTooltipBarChart';
import { useFollowingTooltip } from './useFollowingTooltip';

export type SingleAreaTooltipBarChartWithTooltipProps<CategoryT extends DomainValue> = {
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

export function SingleAreaTooltipBarChartWithTooltip<CategoryT extends DomainValue>({
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
}: SingleAreaTooltipBarChartWithTooltipProps<CategoryT>): ReactElement | null {
  const [interactionProps, referenceProps, tippyProps] = useFollowingTooltip(
    renderTooltipContent,
    hideOnScroll
  );
  return (
    <>
      <SingleAreaTooltipBarChart
        svgRef={referenceProps.ref}
        data={data}
        margins={margins}
        width={width}
        height={height}
        transitionSeconds={transitionSeconds}
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
        ariaRoleDescription={ariaRoleDescription}
        description={description}
        ariaDescribedby={ariaDescribedby}
        datumAriaRoleDescription={datumAriaRoleDescription}
        datumAriaLabel={datumAriaLabel}
        datumDescription={datumDescription}
        {...interactionProps}
      />
      <Tippy {...tippyProps} />
    </>
  );
}
