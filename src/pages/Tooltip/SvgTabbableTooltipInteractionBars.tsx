import { ReactElement } from 'react';
import type { AxisDomain, AxisScale } from 'd3-axis';

import type { CategoryValueDatum, ChartOrientation, Rect } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';

import { createBarDataGenerator } from '../../components/SvgBars';
import { SvgGroup } from '../../components/SvgGroup';

type SvgTabbableTooltipInteractionBarProps<CategoryT extends AxisDomain, ValueT extends AxisDomain> = {
  datum: CategoryValueDatum<CategoryT, ValueT>;
  translateX: number;
  translateY: number;
  generator: (d: CategoryValueDatum<CategoryT, ValueT>, returnInteractionArea?: boolean) => Rect | null;
  onMouseEnter?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onMouseLeave?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onFocus?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onBlur?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
};

function SvgTabbableTooltipInteractionBar<CategoryT extends AxisDomain, ValueT extends AxisDomain>({
  datum,
  translateX,
  translateY,
  generator,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur
}: SvgTabbableTooltipInteractionBarProps<CategoryT, ValueT>) {
  const interactionRect = generator(datum, true);
  const barRect = generator(datum, false);
  // TODO improve this
  if (barRect) {
    barRect.x = barRect.x + translateX;
    barRect.y = barRect.y + translateY;
  }
  return (
    <rect
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
      onMouseOver={() => barRect && onMouseEnter?.(datum, barRect)}
      onMouseOut={() => barRect && onMouseLeave?.(datum, barRect)}
      onFocus={() => barRect && onFocus?.(datum, barRect)}
      onBlur={() => barRect && onBlur?.(datum, barRect)}
      // Hide on scroll on a touch device is problematic.
      // onFocus is used to show the tooltip. If the user then scrolls
      // the tooltip is hidden. If they then touch again on the same bar,
      // the bar already has focus and so onFocus is not fired.
      onClick={() => barRect && onFocus?.(datum, barRect)}
    />
  );
}

// ref.current.addEventListener(
//     "touchstart",
//     function(e) {
//       e.preventDefault();
//     },
//     { passive: false }
//   );

export type SvgTabbableTooltipInteractionBarsProps<
  CategoryT extends AxisDomain,
  ValueT extends AxisDomain
> = {
  data: CategoryValueDatum<CategoryT, ValueT>[];
  translateX: number;
  translateY: number;
  chartWidth: number;
  chartHeight: number;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  valueScale: AxisScale<ValueT>;
  className?: string;
  onMouseEnter?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onMouseLeave?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onFocus?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onBlur?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
};

// TODO what about the case where the user does not want gaps in the bar interactions?
export function SvgTabbableTooltipInteractionBars<CategoryT extends AxisDomain, ValueT extends AxisDomain>({
  data,
  translateX,
  translateY,
  chartWidth,
  chartHeight,
  categoryScale,
  valueScale,
  orientation,
  className = '',
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur
}: SvgTabbableTooltipInteractionBarsProps<CategoryT, ValueT>): ReactElement | null {
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
      {data.map((d) => (
        <SvgTabbableTooltipInteractionBar
          key={getAxisDomainAsReactKey(d.category)}
          datum={d}
          translateX={translateX}
          translateY={translateY}
          generator={generator}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      ))}
    </SvgGroup>
  );
}
