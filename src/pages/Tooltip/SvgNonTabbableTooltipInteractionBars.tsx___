import { ReactElement } from 'react';

import { SvgGroup } from '@/components/SvgGroup';
import { createBarGenerator } from '@/generators/barGenerator';
import type { AxisScale, CategoryValueDatum, ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';
import { translateRect } from '@/utils/renderUtils';

type SvgNonTabbableTooltipInteractionBarProps<CategoryT extends DomainValue, ValueT extends DomainValue> = {
  datum: CategoryValueDatum<CategoryT, ValueT>;
  translateX: number;
  translateY: number;
  barGenerator: (d: CategoryValueDatum<CategoryT, ValueT>, returnInteractionArea?: boolean) => Rect | null;
  onMouseEnter?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onMouseLeave?: () => void;
  onTouch?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
};

function SvgNonTabbableTooltipInteractionBar<CategoryT extends DomainValue, ValueT extends DomainValue>({
  datum,
  translateX,
  translateY,
  barGenerator,
  onMouseEnter,
  onMouseLeave,
  onTouch
}: SvgNonTabbableTooltipInteractionBarProps<CategoryT, ValueT>) {
  const interactionRect = barGenerator(datum, true);
  let barRect = barGenerator(datum, false);
  barRect = translateRect(barRect, translateX, translateY);
  // Used to stop the tooltip showing on a swipe on a touch device.
  //   const touchMovedRef = useRef(false);
  return (
    <rect
      {...interactionRect}
      className="cursor-pointer"
      //   onTouchStart={() => (touchMovedRef.current = false)}
      //   onTouchMove={() => (touchMovedRef.current = true)}
      //   onTouchEnd={(event) => {
      //     if (!touchMovedRef.current) {
      //       barRect && onTouch?.(datum, barRect);
      //     }
      //     event.cancelable && event.preventDefault();
      //   }}
      onMouseEnter={() => barRect && onMouseEnter?.(datum, barRect)}
      onMouseLeave={() => onMouseLeave?.()}
      onClick={(event) => {
        barRect && onTouch?.(datum, barRect);
        event.stopPropagation();
      }}
    />
  );
}

export type SvgNonTabbableTooltipInteractionBarsProps<
  CategoryT extends DomainValue,
  ValueT extends DomainValue
> = {
  data: CategoryValueDatum<CategoryT, ValueT>[];
  chartArea: ChartArea;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  valueScale: AxisScale<ValueT>;
  className?: string;
  onMouseEnter?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onMouseLeave?: () => void;
  onTouch?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
};

// TODO what about the case where the user does not want gaps in the bar interactions?
export function SvgNonTabbableTooltipInteractionBars<
  CategoryT extends DomainValue,
  ValueT extends DomainValue
>({
  data,
  chartArea,
  categoryScale,
  valueScale,
  orientation,
  className = '',
  onMouseEnter,
  onMouseLeave,
  onTouch
}: SvgNonTabbableTooltipInteractionBarsProps<CategoryT, ValueT>): ReactElement | null {
  const barGenerator = createBarGenerator(
    categoryScale,
    valueScale,
    chartArea.width,
    chartArea.height,
    orientation
  );
  return (
    <SvgGroup
      className={className}
      translateX={chartArea.translateLeft}
      translateY={chartArea.translateTop}
      fill="transparent"
      stroke="none"
    >
      {data.map((d) => (
        <SvgNonTabbableTooltipInteractionBar
          key={getAxisDomainAsReactKey(d.category)}
          datum={d}
          translateX={chartArea.translateLeft}
          translateY={chartArea.translateTop}
          barGenerator={barGenerator}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouch={onTouch}
        />
      ))}
    </SvgGroup>
  );
}
