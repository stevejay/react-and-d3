import { ReactElement, RefObject, useEffect, useMemo, useRef } from 'react';
import { useSpring } from '@react-spring/web';
import type { TippyProps } from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react/headless';
import { easeCubicInOut } from 'd3-ease';

import type { Rect } from '@/types';
import { rectsAreEqual } from '@/utils/renderUtils';

import { createVirtualReferenceElement } from './createVirtualReferenceElement';
import { Tooltip } from './Tooltip';
import { useDelayedOnInactivityState } from './useDelayedOnInactivityState';

const popperOptions = {
  modifiers: [{ name: 'flip', enabled: true }]
};

const springConfig = { duration: 150, easing: easeCubicInOut };

type TooltipOptions = { hideTooltipOnScroll?: boolean; xOffset?: number; yOffset?: number };

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
 * @param renderContent Needs to be a referentially stable function.
 */
export function useFollowOnHoverTooltip<DatumT>(
  renderContent: (datum: DatumT) => ReactElement | null,
  options?: TooltipOptions
): ReturnValue<DatumT> {
  const { hideTooltipOnScroll = true, xOffset = 0, yOffset = 18 } = options ?? {};
  const svgRef = useRef<SVGSVGElement>(null);
  const [styles, api] = useSpring(() => ({ opacity: 0 }));

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
    if (tooltipState.visible && hideTooltipOnScroll) {
      const callback = () => {
        setTooltipStateAfter((prev) => ({ ...prev, visible: false }), 0);
      };
      window.document.addEventListener('scroll', callback);
      return () => window.document.removeEventListener('scroll', callback);
    }
  }, [tooltipState.visible, setTooltipStateAfter, hideTooltipOnScroll]);

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
      }
    }),
    [setTooltipStateAfter, setTooltipStateImmediately]
  );

  // Note: appendTo cannot be set to 'parent' as there is overflow clipping on the chart sizer.
  const tippyProps = useMemo(
    () =>
      ({
        reference: svgRef.current,
        placement: 'top',
        offset: [xOffset, yOffset],
        animation: true,
        onShow: () => {
          api.start({ opacity: 1, config: springConfig });
        },
        onHide: ({ unmount }) => {
          api.start({ opacity: 0, config: springConfig, onRest: unmount });
        },
        visible: tooltipState.visible,
        getReferenceClientRect: () => createVirtualReferenceElement(svgRef, tooltipState.rect!),
        popperOptions,
        render: (attrs) => (
          <Tooltip {...attrs} styles={styles as any} ariaHidden>
            {tooltipState.datum && renderContent(tooltipState.datum)}
          </Tooltip>
        )
      } as TippyProps),
    [tooltipState, renderContent, api, styles, xOffset, yOffset]
  );

  return [svgRef, eventHandlers, Tippy, tippyProps];
}
