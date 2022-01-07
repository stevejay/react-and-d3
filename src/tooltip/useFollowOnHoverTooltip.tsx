import { ReactElement, RefObject, useEffect, useMemo, useRef } from 'react';
import type { TippyProps } from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react/headless';
import { animate, useMotionValue } from 'framer-motion';

import type { Rect } from '@/types';
import { rectsAreEqual } from '@/utils/renderUtils';

import { createVirtualReferenceElement } from './createVirtualReferenceElement';
import { Tooltip } from './Tooltip';
import { useDelayedOnInactivityState } from './useDelayedOnInactivityState';

const popperOptions = {
  modifiers: [{ name: 'flip', enabled: true }]
};

type TooltipState<DatumT> = { visible: boolean; rect: Rect | null; datum: DatumT | null };

type ReturnValue<DatumT> = [
  RefObject<SVGSVGElement>,
  {
    onMouseEnter: (datum: DatumT, rect: Rect) => void;
    onMouseLeave: () => void;
    onClick: (datum: DatumT, rect: Rect) => void;
  },
  typeof Tippy,
  TippyProps
];

/**
 * @param renderContent Needs to be a stable function.
 */
export function useFollowOnHoverTooltip<DatumT>(
  renderContent: (datum: DatumT) => ReactElement | null,
  hideOnScroll: boolean
): ReturnValue<DatumT> {
  const svgRef = useRef<SVGSVGElement>(null);
  const opacity = useMotionValue(0);

  const [tooltipState, setTooltipStateAfter, setTooltipStateImmediately] = useDelayedOnInactivityState<
    TooltipState<DatumT>
  >({
    visible: false,
    rect: null,
    datum: null
  });

  // Hide tooltip on any click
  useEffect(() => {
    if (tooltipState.visible) {
      const callback = () => setTooltipStateAfter((prev) => ({ ...prev, visible: false }), 0);
      window.document.addEventListener('click', callback);
      return () => window.document.removeEventListener('click', callback);
    }
  }, [tooltipState.visible, setTooltipStateAfter]);

  // Hide tooltip on scroll
  useEffect(() => {
    if (tooltipState.visible && hideOnScroll) {
      const callback = () => {
        setTooltipStateAfter((prev) => ({ ...prev, visible: false }), 0);
      };
      window.document.addEventListener('scroll', callback);
      return () => window.document.removeEventListener('scroll', callback);
    }
  }, [tooltipState.visible, setTooltipStateAfter, hideOnScroll]);

  const eventHandlers = useMemo(
    () => ({
      onMouseEnter: (datum: DatumT, rect: Rect) => {
        setTooltipStateAfter((prev) => {
          return prev.visible && prev.datum === datum && rectsAreEqual(prev.rect, rect)
            ? prev
            : { visible: true, datum, rect };
        }, 100);
      },
      onMouseLeave: () => {
        setTooltipStateAfter((prev) => (prev.visible ? { ...prev, visible: false } : prev), 0);
      },
      onClick: (datum: DatumT, rect: Rect) => {
        setTooltipStateImmediately((prev) => {
          return prev.visible && prev.datum === datum && rectsAreEqual(prev.rect, rect)
            ? prev
            : { visible: true, datum, rect };
        });

        // setTooltipStateAfter((prev) => {
        //   return prev.visible && prev.datum === datum && rectsAreEqual(prev.rect, rect)
        //     ? prev
        //     : { visible: true, datum, rect };
        // }, 0);
      }
    }),
    [setTooltipStateAfter, setTooltipStateImmediately]
  );

  const tippyProps = useMemo(
    () =>
      ({
        reference: svgRef.current,
        appendTo: 'parent',
        placement: 'top',
        offset: [0, 18],
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
          <Tooltip {...attrs} style={{ opacity }} ariaHidden>
            {tooltipState.datum && renderContent(tooltipState.datum)}
          </Tooltip>
        )
      } as TippyProps),
    [tooltipState, renderContent, opacity]
  );

  return [svgRef, eventHandlers, Tippy, tippyProps];
}
