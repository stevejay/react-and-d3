import { MouseEvent as ReactMouseEvent, ReactElement, RefObject } from 'react';
import type { ScaleBand } from 'd3-scale';

import { SvgGroup } from '@/components/SvgGroup';
import type { AxisScale, CategoryValueDatum, ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';
import { createScaleBandInverter } from '@/utils/renderUtils';

// TODO is there some way to make this work for stacked values?
export type SvgBandScaleEventSourceProps<CategoryT extends DomainValue, ValueT extends DomainValue> = {
  data: CategoryValueDatum<CategoryT, ValueT>[];
  chartArea: ChartArea;
  orientation: ChartOrientation;
  categoryScale: ScaleBand<CategoryT>;
  valueScale: AxisScale<ValueT>;
  className?: string;
  onMouseEnter?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  onMouseLeave?: () => void;
  onTouch?: (datum: CategoryValueDatum<CategoryT, ValueT>, rect: Rect) => void;
  svgRef: RefObject<SVGSVGElement>;
};

export function SvgBandScaleEventSource<CategoryT extends DomainValue, ValueT extends DomainValue>({
  data,
  chartArea,
  categoryScale,
  valueScale,
  orientation,
  className = '',
  onMouseEnter,
  onMouseLeave,
  onTouch,
  svgRef
}: SvgBandScaleEventSourceProps<CategoryT, ValueT>): ReactElement | null {
  const categoryInverter = createScaleBandInverter(categoryScale);
  // Used to stop the tooltip showing on a swipe on a touch device.
  //   const touchMovedRef = useRef(false);

  const lookup = new Map<DomainValue, CategoryValueDatum<CategoryT, ValueT>>();
  data.forEach((datum) => {
    lookup.set(datum.category, datum);
  });

  function getCategoryData(event: ReactMouseEvent<SVGRectElement, MouseEvent>) {
    const category = categoryInverter(
      orientation === 'vertical'
        ? event.nativeEvent.offsetX - chartArea.translateLeft
        : event.nativeEvent.offsetY - chartArea.translateTop
    );
    return lookup.get(category);
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
        className="cursor-pointer"
        x={0}
        y={0}
        width={chartArea.width}
        height={chartArea.height}
        onMouseMove={(event) => {
          //   const category = categoryInverter(
          //     orientation === 'vertical'
          //       ? event.nativeEvent.offsetX - chartArea.translateLeft
          //       : event.nativeEvent.offsetY - chartArea.translateTop
          //   );
          //   const categoryData = lookup.get(category);

          //   console.log('x/y', event.clientX, event.clientY, svgRef.current?.getBoundingClientRect());

          //   const svgRect = svgRef.current?.getBoundingClientRect();
          const rect = { x: event.clientX, y: event.clientY, width: 0, height: 0 };
          const datum = getCategoryData(event);
          datum && onMouseEnter?.(datum, rect);

          //   const datumIndex = data.findIndex((d) => d.category === category);
          //   if (datumIndex > -1) {
          //     const datum = data[datumIndex];
          //     let rect = generator(datum);
          //     rect = translateRect(rect, chartArea.translateLeft, chartArea.translateTop);
          //     rect && onMouseEnter?.(datum, rect);
          //   }
        }}
        onMouseLeave={() => onMouseLeave?.()}
        onClick={(event) => {
          //   const category = categoryInverter(
          //     orientation === 'vertical'
          //       ? event.nativeEvent.offsetX - chartArea.translateLeft
          //       : event.nativeEvent.offsetY - chartArea.translateTop
          //   );
          //   const categoryData = lookup.get(category);

          const rect = { x: event.clientX, y: event.clientY, width: 0, height: 0 };
          const datum = getCategoryData(event);
          datum && onTouch?.(datum, rect);

          //   const datumIndex = data.findIndex((d) => d.category === category);
          //   if (datumIndex > -1) {
          //     const datum = data[datumIndex];
          //     let rect = generator(datum);
          //     rect = translateRect(rect, chartArea.translateLeft, chartArea.translateTop);
          //     rect && onTouch?.(datum, rect);
          //   }
          event.stopPropagation();
        }}

        // onTouchStart={() => (touchMovedRef.current = false)}
        // onTouchMove={() => (touchMovedRef.current = true)}
        // onTouchEnd={(event) => {
        //   if (!touchMovedRef.current && event.changedTouches.length === 1 && svgRef.current) {
        //     const svgRect = svgRef.current.getBoundingClientRect();
        //     console.log('>>', event.changedTouches[0], svgRef.current?.getBoundingClientRect());

        //     const category = inverter(
        //       orientation === 'vertical'
        //         ? event.changedTouches[0].clientX - svgRect.x
        //         : event.changedTouches[0].clientY - svgRect.y
        //     );
        //     const datumIndex = data.findIndex((d) => d.category === category);
        //     if (datumIndex > -1) {
        //       const datum = data[datumIndex];
        //       let rect = generator(datum);
        //       rect = translateRect(rect, chartArea.translateLeft, chartArea.translateTop);
        //       rect && onTouch?.(datum, rect);
        //     }
        //   }
        //   event.cancelable && event.preventDefault();
        // }}
      />
    </SvgGroup>
  );
}
