import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import type { TippyProps } from '@tippyjs/react/headless';

import type { Rect } from '@/types';

// import { useDelayedState } from './useDelayedState';
// import { usePartiallyDelayedState } from './usePartiallyDelayedState';
import { createVirtualReference } from './createVirtualReference';

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

type TooltipState<DatumT> = { visible: boolean; rect: Rect | null; datum: DatumT | null };

export function useTabbableTooltip<DatumT>(): [
  TooltipState<DatumT>,
  {
    onMouseOver: (datum: DatumT, rect: Rect) => void;
    onMouseOut: () => void;
    onFocus: (datum: DatumT, rect: Rect) => void;
    onBlur: () => void;
  },
  RefObject<SVGSVGElement>,
  TippyProps
] {
  const svgRef = useRef<SVGSVGElement>(null);

  //   const [tooltipState, setTooltipStateAfter] = usePartiallyDelayedState<{
  //     visible: boolean;
  //     rect: Rect | null;
  //     datum: CategoryValueDatum<CategoryT, number> | null;
  //   }>({ visible: false, rect: null, datum: null });

  const [tooltipState, setTooltipState] = useState<TooltipState<DatumT>>({
    visible: false,
    rect: null,
    datum: null
  });

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

  const eventHandlers = useMemo(
    () => ({
      onMouseOver: (datum: DatumT, rect: Rect) => {
        console.log('onmouseover');
        setTooltipState({ visible: true, datum, rect });
      },
      onMouseOut: () => {
        console.log('onmouseout');
        setTooltipState((prev) => ({ ...prev, visible: false }));
      },
      onFocus: (datum: DatumT, rect: Rect) => {
        setTooltipState({ visible: true, datum, rect });
      },
      onBlur: () => {
        setTooltipState((prev) => ({ ...prev, visible: false }));
      }
    }),
    [setTooltipState]
  );

  const tippyProps = useMemo(
    () =>
      ({
        reference: svgRef.current,
        appendTo: 'parent',
        placement: 'top',
        offset: [0, 10],
        visible: tooltipState.visible,
        getReferenceClientRect: () => createVirtualReference(svgRef, tooltipState.rect!) as any,
        popperOptions
      } as TippyProps),
    [tooltipState.visible, tooltipState.rect]
  );

  console.log('tippyProps', tippyProps);

  return [tooltipState, eventHandlers, svgRef, tippyProps];
}
