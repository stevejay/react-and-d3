import { ReactElement } from 'react';
import type { AxisDomain, AxisScale } from 'd3';

import type { CategoryValueDatum, ChartOrientation, Rect } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';

import { createBarDataGenerator } from './SvgBars';
import { SvgGroup } from './SvgGroup';

export type SvgInteractionBarsProps<CategoryT extends AxisDomain, ValueT extends AxisDomain> = {
  data: CategoryValueDatum<CategoryT, ValueT>[];
  translateX: number;
  translateY: number;
  chartWidth: number;
  chartHeight: number;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  valueScale: AxisScale<ValueT>;
  className?: string;
  onMouseOver?: (
    datum: CategoryValueDatum<CategoryT, ValueT>,
    rect: Rect
    // pointerType: PointerEvent<SVGRectElement>['pointerType']
  ) => void;
  onMouseOut?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onFocus?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onBlur?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
};

// TODO what about the case where the user does not want gaps in the bar interactions?
export function SvgInteractionBars<CategoryT extends AxisDomain, ValueT extends AxisDomain>({
  data,
  translateX,
  translateY,
  chartWidth,
  chartHeight,
  categoryScale,
  valueScale,
  orientation,
  className = '',
  onMouseOver,
  onMouseOut,
  onFocus,
  onBlur
}: SvgInteractionBarsProps<CategoryT, ValueT>): ReactElement<any, any> | null {
  const generator = createBarDataGenerator(
    categoryScale,
    valueScale,
    chartWidth,
    chartHeight,
    orientation,
    0
  );
  return (
    <SvgGroup
      className={className}
      translateX={translateX}
      translateY={translateY}
      fill="transparent"
      stroke="none"
    >
      {data.map((d) => {
        const interactionRect = generator(d, true);
        const barRect = generator(d, false);
        // TODO improve this
        if (barRect) {
          barRect.x = barRect.x + translateX;
          barRect.y = barRect.y + translateY;
        }
        return (
          <rect
            key={getAxisDomainAsReactKey(d.category)}
            {...interactionRect}
            className="outline-none cursor-pointer"
            // mouseover used instead of mouseenter.
            // Can't use onMouseEnter as it doesn't work well in Safari. If you click on a
            // bar, scroll down the page, scroll back up and then click again on the same
            // bar, the onMouseEnter event doesn't seem to fire.
            // onMouseOver={() => barRect && onMouseOver?.(d, barRect)}
            // onMouseOut={() => barRect && onMouseOut?.(d, barRect)}

            // This is the approach that react-bootstrap takes to tooltips.
            // They are made focusable (tabIndex=0). This means they work
            // on touch and display for keyboard users.
            // tabIndex={0}
            // onFocus={() => barRect && onFocus?.(d, barRect)}
            // onBlur={() => barRect && onBlur?.(d, barRect)}

            // This is the default for Tippy.
            tabIndex={0} // Required because a rect does not naturally receive focus.
            onMouseEnter={() => barRect && onMouseOver?.(d, barRect)}
            onFocus={() => barRect && onMouseOver?.(d, barRect)}
            onMouseLeave={() => barRect && onMouseOut?.(d, barRect)}
            onBlur={() => barRect && onMouseOut?.(d, barRect)}
          />
        );
      })}
    </SvgGroup>
  );
}
