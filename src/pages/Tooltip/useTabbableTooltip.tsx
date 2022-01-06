import { ReactElement, RefObject, useEffect, useMemo, useRef } from 'react';
import type { TippyProps } from '@tippyjs/react/headless';
import { animate, useMotionValue } from 'framer-motion';

import type { Rect } from '@/types';
import { rectsAreEqual } from '@/utils/renderUtils';

import { createVirtualReferenceElement } from './createVirtualReferenceElement';
import { Tooltip } from './Tooltip';
import { usePartiallyDelayedState } from './usePartiallyDelayedState';

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

export function useTabbableTooltip<DatumT>(
  renderContent: (datum: DatumT) => ReactElement | null,
  hideOnScroll: boolean
): [
  {
    onMouseEnter: (datum: DatumT, rect: Rect) => void;
    onMouseLeave: () => void;
    onFocus: (datum: DatumT, rect: Rect) => void;
    onBlur: () => void;
  },
  { ref: RefObject<SVGSVGElement> },
  TippyProps
] {
  const svgRef = useRef<SVGSVGElement>(null);
  const opacity = useMotionValue(0);

  const [tooltipState, setTooltipState] = usePartiallyDelayedState<TooltipState<DatumT>>({
    visible: false,
    rect: null,
    datum: null
  });

  // Hide tooltip on scroll
  useEffect(() => {
    if (tooltipState.visible && hideOnScroll) {
      const callback = () => {
        setTooltipState((prev) => ({ ...prev, visible: false }), 0);
      };
      window.document.addEventListener('scroll', callback);
      return () => window.document.removeEventListener('scroll', callback);
    }
  }, [tooltipState.visible, setTooltipState, hideOnScroll]);

  const eventHandlers = useMemo(
    () => ({
      onMouseEnter: (datum: DatumT, rect: Rect) => {
        setTooltipState((prev) => {
          return prev.visible && prev.datum === datum && rectsAreEqual(prev.rect, rect)
            ? prev
            : { visible: true, datum, rect };
        }, 500);
      },
      onMouseLeave: () => {
        setTooltipState((prev) => (prev.visible ? { ...prev, visible: false } : prev), 0);
      },
      onFocus: (datum: DatumT, rect: Rect) => {
        setTooltipState((prev) => {
          return prev.visible && prev.datum === datum && rectsAreEqual(prev.rect, rect)
            ? prev
            : { visible: true, datum, rect };
        }, 0);
      },
      onBlur: () => {
        setTooltipState((prev) => (prev.visible ? { ...prev, visible: false } : prev), 0);
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
        animation: true,
        onShow: () => {
          animate(opacity, 1, { type: 'tween', duration: 0.15 });
        },
        onHide: ({ unmount }) => {
          animate(opacity, 0, { type: 'tween', duration: 0.15, onComplete: unmount });
        },
        visible: tooltipState.visible,
        getReferenceClientRect: () => createVirtualReferenceElement(svgRef, tooltipState.rect!),
        popperOptions,
        render: (attrs) => (
          <Tooltip {...attrs} style={{ opacity }}>
            {tooltipState.datum && renderContent(tooltipState.datum)}
          </Tooltip>
        )
      } as TippyProps),
    [tooltipState, renderContent, opacity]
  );

  return [eventHandlers, { ref: svgRef }, tippyProps];
}
