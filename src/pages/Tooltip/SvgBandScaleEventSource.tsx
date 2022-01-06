import { MouseEvent as ReactMouseEvent, ReactElement, RefObject } from 'react';
import type { ScaleBand } from 'd3-scale';

import { SvgGroup } from '@/components/SvgGroup';
import type { ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';
import { createScaleBandInverter } from '@/utils/renderUtils';

function createTooltipRect(event: ReactMouseEvent<SVGRectElement, MouseEvent>, svgRect?: DOMRect) {
  return {
    x: event.clientX - (svgRect?.x ?? 0),
    y: event.clientY - (svgRect?.y ?? 0),
    width: 0,
    height: 0
  };
}

// TODO is there some way to make this work for stacked values?
export type SvgBandScaleEventSourceProps<
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

export function SvgBandScaleEventSource<
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
}: SvgBandScaleEventSourceProps<CategoryT, DatumT>): ReactElement | null {
  const categoryInverter = createScaleBandInverter(categoryScale);

  const datumLookup = new Map<DomainValue, DatumT>();
  data.forEach((datum) => datumLookup.set(datum.category, datum));

  function getCategoryData(event: ReactMouseEvent<SVGRectElement, MouseEvent>) {
    const category = categoryInverter(
      orientation === 'vertical'
        ? event.nativeEvent.offsetX - chartArea.translateLeft
        : event.nativeEvent.offsetY - chartArea.translateTop
    );
    return datumLookup.get(category);
  }

  return (
    <SvgGroup
      className={className}
      translateX={chartArea.translateLeft}
      translateY={chartArea.translateTop}
      fill="transparent"
      stroke="none"
    >
      <rect
        x={0}
        y={0}
        width={chartArea.width}
        height={chartArea.height}
        onMouseMove={(event) => {
          const svgRect = svgRef.current?.getBoundingClientRect();
          const rect = createTooltipRect(event, svgRect);
          //   const rect = {
          //     x: event.clientX - (svgRect?.x ?? 0),
          //     y: event.clientY - (svgRect?.y ?? 0),
          //     width: 0,
          //     height: 0
          //   };
          const datum = getCategoryData(event);
          datum && onMouseEnter(datum, rect);
        }}
        onMouseLeave={onMouseLeave}
        onClick={(event) => {
          const svgRect = svgRef.current?.getBoundingClientRect();
          const rect = createTooltipRect(event, svgRect);
          const datum = getCategoryData(event);
          datum && onClick(datum, rect);
          event.stopPropagation();
        }}
      />
    </SvgGroup>
  );
}
