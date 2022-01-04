import { ReactElement, useRef } from 'react';

import { createBarDataGenerator } from '@/components/SvgBars';
import { SvgGroup } from '@/components/SvgGroup';
import type { AxisScale, CategoryValueDatum, ChartOrientation, DomainValue, Rect } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';

type SvgNonTabbableTooltipInteractionBarProps<CategoryT extends DomainValue, ValueT extends DomainValue> = {
  datum: CategoryValueDatum<CategoryT, ValueT>;
  translateX: number;
  translateY: number;
  generator: (d: CategoryValueDatum<CategoryT, ValueT>, returnInteractionArea?: boolean) => Rect | null;
  onMouseEnter?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onMouseLeave?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onTouch?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
};

function SvgNonTabbableTooltipInteractionBar<CategoryT extends DomainValue, ValueT extends DomainValue>({
  datum,
  translateX,
  translateY,
  generator,
  onMouseEnter,
  onMouseLeave,
  onTouch
}: SvgNonTabbableTooltipInteractionBarProps<CategoryT, ValueT>) {
  const interactionRect = generator(datum, true);
  const barRect = generator(datum, false);
  // TODO improve this
  if (barRect) {
    barRect.x = barRect.x + translateX;
    barRect.y = barRect.y + translateY;
  }
  // Used to stop the tooltip showing on a swipe on a touch device.
  const touchMovedRef = useRef(false);
  return (
    <rect
      {...interactionRect}
      className="outline-none cursor-pointer"
      onTouchStart={() => (touchMovedRef.current = false)}
      onTouchMove={() => (touchMovedRef.current = true)}
      onTouchEnd={(event) => {
        if (!touchMovedRef.current) {
          barRect && onTouch?.(datum, barRect);
        }
        event.cancelable && event.preventDefault();
      }}
      onMouseEnter={() => barRect && onMouseEnter?.(datum, barRect)}
      onMouseLeave={() => barRect && onMouseLeave?.(datum, barRect)}
    />
  );
}

export type SvgNonTabbableTooltipInteractionBarsProps<
  CategoryT extends DomainValue,
  ValueT extends DomainValue
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
  onTouch?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
};

// TODO what about the case where the user does not want gaps in the bar interactions?
export function SvgNonTabbableTooltipInteractionBars<
  CategoryT extends DomainValue,
  ValueT extends DomainValue
>({
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
  onTouch
}: SvgNonTabbableTooltipInteractionBarsProps<CategoryT, ValueT>): ReactElement | null {
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
        <SvgNonTabbableTooltipInteractionBar
          key={getAxisDomainAsReactKey(d.category)}
          datum={d}
          translateX={translateX}
          translateY={translateY}
          generator={generator}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouch={onTouch}
        />
      ))}
    </SvgGroup>
  );
}
