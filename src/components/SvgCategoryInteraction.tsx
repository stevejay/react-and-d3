import { ReactElement, RefObject, useRef } from 'react';
import type { ScaleBand } from 'd3-scale';
import { round } from 'lodash-es';

import { SvgGroup } from '@/components/SvgGroup';
import type { ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';
import { createScaleBandInverter } from '@/utils/renderUtils';

function createTooltipRect(event: { clientX: number; clientY: number }, svgRect?: DOMRect) {
  return {
    x: round(event.clientX) - (svgRect?.x ?? 0),
    y: round(event.clientY) - (svgRect?.y ?? 0),
    width: 0,
    height: 0
  };
}

export type SvgCategoryInteractionProps<
  CategoryT extends DomainValue,
  DatumT extends { category: CategoryT }
> = {
  data: readonly DatumT[];
  chartArea: ChartArea;
  orientation: ChartOrientation;
  categoryScale: ScaleBand<CategoryT>;
  className?: string;
  onMouseEnter: (datum: DatumT, rect: Rect) => void;
  onMouseLeave: () => void;
  onClick: (datum: DatumT, rect: Rect) => void;
  svgRef: RefObject<SVGSVGElement>;
};

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
  onMouseEnter,
  onMouseLeave,
  onClick
}: SvgCategoryInteractionProps<CategoryT, DatumT>): ReactElement | null {
  const categoryInverter = createScaleBandInverter(categoryScale);

  const datumLookup = new Map<DomainValue, DatumT>();
  data.forEach((datum) => datumLookup.set(datum.category, datum));

  const isSwiping = useRef(false);

  return (
    <SvgGroup
      translateX={chartArea.translateLeft}
      translateY={chartArea.translateTop}
      className={className}
      fill="transparent"
      stroke="none"
    >
      <rect
        role="presentation"
        x={0}
        y={0}
        width={chartArea.width}
        height={chartArea.height}
        onMouseMove={(event) => {
          const svgRect = svgRef.current?.getBoundingClientRect();
          const rect = createTooltipRect(event, svgRect);
          const category = categoryInverter(
            orientation === 'vertical' ? rect.x - chartArea.translateLeft : rect.y - chartArea.translateTop
          );
          const datum = datumLookup.get(category);
          datum && onMouseEnter(datum, rect);
        }}
        onMouseLeave={onMouseLeave}
        onClick={(event) => {
          // Prevent clicks from being picked up by the document.window
          // onclick event listener, which closes the tooltip on a click
          // outside of the chart area.
          event.stopPropagation();
        }}
        onTouchStart={() => (isSwiping.current = false)}
        onTouchMove={() => (isSwiping.current = true)}
        onTouchEnd={(event) => {
          event.preventDefault();
          if (isSwiping.current) {
            return;
          }
          const svgRect = svgRef.current?.getBoundingClientRect();
          const clientX = round(event.changedTouches[0].clientX);
          const clientY = round(event.changedTouches[0].clientY);
          const category = categoryInverter(
            orientation === 'vertical'
              ? clientX - (svgRect?.x ?? 0) - chartArea.translateLeft
              : clientY - (svgRect?.y ?? 0) - chartArea.translateTop
          );
          const datum = datumLookup.get(category);

          if (datum) {
            const rect = {
              x: round(
                chartArea.translateLeft +
                  (categoryScale(datum.category) ?? NaN) +
                  categoryScale.bandwidth() * 0.5
              ),
              y: clientY - (svgRect?.y ?? 0),
              width: 0,
              height: 0
            };
            onClick(datum, rect);
          }
        }}
      />
    </SvgGroup>
  );
}
