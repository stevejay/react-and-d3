import { ReactElement, RefObject, useEffect, useMemo, useRef } from 'react';
import type { TippyProps } from '@tippyjs/react/headless';
import { animate, useMotionValue } from 'framer-motion';

import type { Rect } from '@/types';
import { createDOMRectFromRect, rectsAreEqual } from '@/utils/renderUtils';

import { Tooltip } from './Tooltip';
import { usePartiallyDelayedState } from './usePartiallyDelayedState';

const popperOptions = {
  modifiers: [{ name: 'flip', enabled: true }]
};

type TooltipState<DatumT> = { visible: boolean; rect: Rect | null; datum: DatumT | null };

export function useFollowingTooltip<DatumT>(
  renderContent: (datum: DatumT) => ReactElement | null,
  hideOnScroll: boolean
): [
  {
    onMouseEnter: (datum: DatumT, rect: Rect) => void;
    onMouseLeave: () => void;
    onTouch: (datum: DatumT, rect: Rect) => void;
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

  // Hide tooltip on any click
  useEffect(() => {
    if (tooltipState.visible) {
      const callback = () => setTooltipState((prev) => ({ ...prev, visible: false }), 0);
      window.document.addEventListener('click', callback);
      return () => window.document.removeEventListener('click', callback);
    }
  }, [tooltipState.visible, setTooltipState]);

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
      onTouch: (datum: DatumT, rect: Rect) => {
        setTooltipState((prev) => {
          return prev.visible && prev.datum === datum && rectsAreEqual(prev.rect, rect)
            ? prev
            : { visible: true, datum, rect };
        }, 0);
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
        offset: [0, 20],
        animation: true,
        onShow: () => {
          animate(opacity, 1, { type: 'tween', duration: 0.15 });
        },
        onHide: ({ unmount }) => {
          animate(opacity, 0, { type: 'tween', duration: 0.15, onComplete: unmount });
        },
        visible: tooltipState.visible,
        getReferenceClientRect: () => createDOMRectFromRect(tooltipState.rect!),
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
