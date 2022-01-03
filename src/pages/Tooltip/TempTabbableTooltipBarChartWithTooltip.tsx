import { ReactElement, RefObject, useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import type { AxisDomain } from 'd3-axis';

import { CategoryValueDatum, Margins, Rect } from '@/types';

// import { useDelayedState } from './useDelayedState';
// import { usePartiallyDelayedState } from './usePartiallyDelayedState';
import { TempTabbableTooltipBarChart } from './TempTabbableTooltipBarChart';
import { Tooltip } from './Tooltip';

// const LazyTippy = forwardRef<any, any>((props, ref) => {
//   const [mounted, setMounted] = useState(false);

//   const lazyPlugin = {
//     fn: () => ({
//       onMount: () => setMounted(true),
//       onHidden: () => setMounted(false)
//     })
//   };

//   const computedProps = { ...props };

//   computedProps.plugins = [lazyPlugin, ...(props.plugins || [])];

//   if (props.render) {
//     computedProps.render = (...args: any) => (mounted ? props.render(...args) : '');
//   } else {
//     computedProps.content = mounted ? props.content : '';
//   }

//   return <Tippy {...computedProps} ref={ref} />;
// });

// https://github.com/keplergl/kepler.gl/blob/612e18a9988b580f9258eb427e76bbdcfc49072b/src/components/map/map-popover.js#L129
function createVirtualReference(container: RefObject<SVGSVGElement>, r: Rect) {
  const bounds =
    container.current && container.current.getBoundingClientRect
      ? container.current.getBoundingClientRect()
      : { left: 0, top: 0 };
  const left = (bounds.left ?? 0) + r.x;
  const top = (bounds.top ?? 0) + r.y;
  return {
    left,
    top,
    right: left + r.width,
    bottom: top + r.height,
    width: r.width,
    height: r.height
  };
}

const popperOptions = {
  modifiers: [
    {
      name: 'flip',
      enabled: true,
      // Allow space for the sticky header. This cannot be a rem value.
      options: { padding: { top: 63 } }
    }
  ]
};

// export type TempTabbableTooltipBarChartWithTooltipProps<CategoryT extends AxisDomain> = Omit<
//   TempTabbableTooltipBarChartProps<CategoryT>,
//   'svgRef' | 'onMouseOver' | 'onMouseOut' | 'onFocus' | 'onBlur'
// > & {
//   renderTooltipContent: (datum: CategoryValueDatum<CategoryT, number>) => ReactElement | null;
// };

export type TempTabbableTooltipBarChartWithTooltipProps<CategoryT extends AxisDomain> = {
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
  datumAriaDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  transitionSeconds?: number;
  renderTooltipContent: (datum: CategoryValueDatum<CategoryT, number>) => ReactElement | null;
};

// function useChartTooltip<DatumT>() {
//   const [tooltipVisible, setTooltipVisible] = useState(false);

//   const [tooltipState, setTooltipState] = useState<{
//     rect: Rect | null;
//     datum: DatumT | null;
//   }>({
//     rect: null,
//     datum: null
//   });
// }

//   const [tooltipState, setTooltipStateAfter] = usePartiallyDelayedState<{
//     visible: boolean;
//     rect: Rect | null;
//     datum: CategoryValueDatum<CategoryT, number> | null;
//   }>({ visible: false, rect: null, datum: null });

export function TempTabbableTooltipBarChartWithTooltip<CategoryT extends AxisDomain>(
  props: TempTabbableTooltipBarChartWithTooltipProps<CategoryT>
): ReactElement | null {
  const svgRef = useRef<SVGSVGElement>(null);

  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    rect: Rect | null;
    datum: CategoryValueDatum<CategoryT, number> | null;
  }>({ visible: false, rect: null, datum: null });

  // Hide tooltip on any click
  useEffect(() => {
    if (tooltipState.visible) {
      const callback = () => setTooltipState((prev) => ({ ...prev, visible: false }));
      window.document.addEventListener('click', callback);
      return () => window.document.removeEventListener('click', callback);
    }
  }, [tooltipState.visible, setTooltipState]);

  // Hide tooltip on scroll
  useEffect(() => {
    if (tooltipState.visible) {
      const callback = () => setTooltipState((prev) => ({ ...prev, visible: false }));
      window.document.addEventListener('scroll', callback);
      return () => window.document.removeEventListener('scroll', callback);
    }
  }, [tooltipState.visible, setTooltipState]);

  return (
    <>
      <TempTabbableTooltipBarChart
        svgRef={svgRef}
        {...props}
        onMouseOver={(datum, rect) => {
          setTooltipState({ visible: true, datum, rect });
        }}
        onMouseOut={() => {
          setTooltipState((prev) => ({ ...prev, visible: false }));
        }}
        onFocus={(datum, rect) => {
          setTooltipState({ visible: true, datum, rect });
        }}
        onBlur={() => {
          setTooltipState((prev) => ({ ...prev, visible: false }));
        }}
      />
      <Tippy
        reference={svgRef.current}
        appendTo="parent"
        placement="top"
        offset={[0, 10]}
        visible={tooltipState.visible}
        // getReferenceClientRect={() =>
        //   tooltipVisible ? (createVirtualReference(svgRef, tooltipState.rect!) as any) : null
        // }
        // hideOnClick
        // onClickOutside
        getReferenceClientRect={() => createVirtualReference(svgRef, tooltipState.rect!) as any}
        // onShow={() => {
        //   animate(opacity, 1, { type: 'tween', duration: 0.15 });
        // }}
        // onHide={({ unmount }) => {
        //   animate(opacity, 0, { type: 'tween', duration: 0.15, onComplete: unmount });
        // }}
        popperOptions={popperOptions}
        render={(attrs) => (
          <Tooltip {...attrs}>{tooltipState.datum && props.renderTooltipContent(tooltipState.datum)}</Tooltip>
        )}
      />
    </>
  );
}
