import { ReactElement, RefObject, useRef } from 'react';
import Tippy from '@tippyjs/react/headless';
import type { AxisDomain } from 'd3';

import { CategoryValueDatum, Rect } from '@/types';

import { TooltipArrow } from './TooltipArrow';
// import { useDelayedState } from './useDelayedState';
import { usePartiallyDelayedState } from './usePartiallyDelayedState';
import { VerticalBarChart, VerticalBarChartProps } from './VerticalBarChart';

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

type VerticalBarChartPropsWithTooltip<CategoryT extends AxisDomain> = Omit<
  VerticalBarChartProps<CategoryT>,
  'SvgRef' | 'onMouseOver' | 'onMouseLeave'
> & {
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

export function VerticalBarChartWithTooltip<CategoryT extends AxisDomain>(
  props: VerticalBarChartPropsWithTooltip<CategoryT>
): ReactElement<any, any> | null {
  const svgRef = useRef<SVGSVGElement>(null);

  const [tooltipState, setTooltipStateAfter] = usePartiallyDelayedState<{
    visible: boolean;
    rect: Rect | null;
    datum: CategoryValueDatum<CategoryT, number> | null;
  }>({ visible: false, rect: null, datum: null });

  // Hide tooltip on scroll
  //   useEffect(() => {
  //     if (tooltipState.visible) {
  //       const callback = () => setTooltipStateAfter((prev) => ({ ...prev, visible: false }), 0);
  //       window.document.addEventListener('scroll', callback);
  //       return () => window.document.removeEventListener('scroll', callback);
  //     }
  //   }, [tooltipState.visible, setTooltipStateAfter]);

  return (
    <>
      <VerticalBarChart
        svgRef={svgRef}
        {...props}
        // onTouchStart={(datum, rect) => {
        //   setTooltipStateAfter({ visible: true, datum, rect }, 0);
        //   // tooltipState.visible ? 0 : 500);
        //   //   setTooltipVisible(true);
        //   //   setTooltipState({ datum, rect });
        // }}
        // onPointerOver={(datum, rect, pointerType) => {
        //   setTooltipStateAfter({ visible: true, datum, rect }, pointerType === 'mouse' ? 500 : 0);
        // }}
        // onPointerLeave={() => {
        //   setTooltipStateAfter((prev) => ({ ...prev, visible: false }), 0);
        //   //   setTooltipVisible(false);
        // }}
        onMouseOver={(datum, rect) => {
          setTooltipStateAfter({ visible: true, datum, rect }, 500);
        }}
        onMouseOut={() => {
          setTooltipStateAfter((prev) => ({ ...prev, visible: false }), 0);
          //   setTooltipVisible(false);
        }}
        onFocus={(datum, rect) => {
          setTooltipStateAfter({ visible: true, datum, rect }, 0);
        }}
        onBlur={() => {
          setTooltipStateAfter((prev) => ({ ...prev, visible: false }), 0);
          //   setTooltipVisible(false);
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
        // popperOptions={popperOptions}
        // render={(attrs) => (
        //   <motion.div
        //     {...attrs}
        //     style={{ opacity }}
        //     className="max-w-xs p-2 text-xs leading-tight text-left text-white border border-gray-800 rounded-sm opacity-0 bg-gray-999 shadow-nav"
        //   >
        //     {tooltipState.datum && renderTooltipContent(tooltipState.datum)}
        //     <TooltipArrow {...attrs} />
        //   </motion.div>
        // )}
        render={(attrs) => (
          <div
            {...attrs}
            // style={{ opacity }}
            aria-hidden
            className="max-w-xs p-2 text-xs leading-tight text-left border rounded shadow-sm select-none border-slate-600 bg-slate-900"
          >
            {tooltipState.datum && props.renderTooltipContent(tooltipState.datum)}
            <TooltipArrow {...attrs} />
          </div>
        )}
      />
    </>
  );
}
