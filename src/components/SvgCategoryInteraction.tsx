import { ReactElement, RefObject, TouchEvent, useRef } from 'react';
import { ScaleBand } from 'd3-scale';

import { SvgGroup } from '@/components/SvgGroup';
import { ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';
import { createScaleBandInverter } from '@/utils/renderUtils';

function createVirtualElementRectFromMouseEvent(
  event: { clientX: number; clientY: number },
  svgRect?: DOMRect
) {
  return {
    x: Math.round(event.clientX) - (svgRect?.x ?? 0),
    y: Math.round(event.clientY) - (svgRect?.y ?? 0),
    width: 0,
    height: 0
  };
}

function createVirtualElementRectFromTouchEvent(event: TouchEvent, svgRect?: DOMRect) {
  return {
    x: Math.round(event.changedTouches[0].clientX) - (svgRect?.x ?? 0),
    y: Math.round(event.changedTouches[0].clientY) - (svgRect?.y ?? 0),
    width: 0,
    height: 0
  };
}

function snapVirtualElementRectToCategory<
  CategoryT extends DomainValue,
  DatumT extends { category: CategoryT }
>(
  rect: Rect,
  chartArea: ChartArea,
  orientation: ChartOrientation,
  categoryScale: ScaleBand<CategoryT>,
  datum: DatumT
) {
  const delta = (categoryScale(datum.category) ?? NaN) + categoryScale.bandwidth() * 0.5;
  if (orientation === 'vertical') {
    return { ...rect, x: Math.round(chartArea.translateLeft + delta) };
  } else {
    return { ...rect, y: Math.round(chartArea.translateTop + delta) + 10 }; // 10 is offset for tooltip arrow
  }
}

export interface SvgCategoryInteractionProps<
  CategoryT extends DomainValue,
  DatumT extends { category: CategoryT }
> {
  data: readonly DatumT[];
  chartArea: ChartArea;
  orientation: ChartOrientation;
  categoryScale: ScaleBand<CategoryT>;
  className?: string;
  onMouseMove: (datum: DatumT, rect: Rect) => void;
  onMouseLeave: () => void;
  onClick: (datum: DatumT, rect: Rect) => void;
  svgRef: RefObject<SVGSVGElement>;
}

// This works for both CategoryValueDatum and CategoryValueListDatum.
export function SvgCategoryInteraction<
  CategoryT extends DomainValue,
  DatumT extends { category: CategoryT }
>({
  data,
  chartArea,
  categoryScale,
  orientation,
  className = '',
  svgRef,
  onMouseMove,
  onMouseLeave,
  onClick
}: SvgCategoryInteractionProps<CategoryT, DatumT>): ReactElement | null {
  const categoryInverter = createScaleBandInverter(categoryScale);

  const datumLookup = new Map<DomainValue, DatumT>();
  data.forEach((datum) => datumLookup.set(datum.category, datum));

  const isSwiping = useRef(false);

  return (
    <SvgGroup
      data-test-id="category-interaction"
      translateX={chartArea.translateLeft}
      translateY={chartArea.translateTop}
      className={className}
      fill="transparent"
      stroke="none"
    >
      <rect
        data-test-id="interaction-area"
        role="presentation"
        className="touch-manipulation"
        x={0}
        y={0}
        width={chartArea.width}
        height={chartArea.height}
        onMouseMove={(event) => {
          const svgRect = svgRef.current?.getBoundingClientRect();
          const rect = createVirtualElementRectFromMouseEvent(event, svgRect);
          const category = categoryInverter(
            orientation === 'vertical' ? rect.x - chartArea.translateLeft : rect.y - chartArea.translateTop
          );
          const datum = datumLookup.get(category);
          datum && onMouseMove(datum, rect);
        }}
        onMouseLeave={onMouseLeave}
        onClick={(event) => {
          // Prevent clicks from being picked up by the document.window
          // onclick event listener, which closes the tooltip on a click
          // outside of the chart area.
          event.stopPropagation();
        }}
        onTouchStart={(e) => {
          isSwiping.current = false;
        }}
        onTouchMove={() => (isSwiping.current = true)}
        onTouchEnd={(event) => {
          // Prevent the emulated mouse events from being fired after this event.
          event.preventDefault();

          // Bail out early if the touch was a swipe.
          if (isSwiping.current) {
            return;
          }

          const svgRect = svgRef.current?.getBoundingClientRect();
          const rect = createVirtualElementRectFromTouchEvent(event, svgRect);
          const category = categoryInverter(
            orientation === 'vertical' ? rect.x - chartArea.translateLeft : rect.y - chartArea.translateTop
          );
          const datum = datumLookup.get(category);
          datum &&
            onClick(
              datum,
              snapVirtualElementRectToCategory(rect, chartArea, orientation, categoryScale, datum)
            );
        }}
      />
    </SvgGroup>
  );
}
