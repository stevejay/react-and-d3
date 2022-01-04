import { ReactElement, RefObject, useEffect, useMemo, useRef } from 'react';
import type { TippyProps } from '@tippyjs/react/headless';

import type { Rect } from '@/types';

import { createVirtualReference } from './createVirtualReference';
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

export function useTabbableTooltip<DatumT>(renderContent: (datum: DatumT) => ReactElement | null): [
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

  const [tooltipState, setTooltipState] = usePartiallyDelayedState<TooltipState<DatumT>>({
    visible: false,
    rect: null,
    datum: null
  });

  // Hide tooltip on scroll
  useEffect(() => {
    if (tooltipState.visible) {
      const callback = () => {
        setTooltipState((prev) => ({ ...prev, visible: false }), 0);
      };
      window.document.addEventListener('scroll', callback);
      return () => window.document.removeEventListener('scroll', callback);
    }
  }, [tooltipState.visible, setTooltipState]);

  const eventHandlers = useMemo(
    () => ({
      onMouseEnter: (datum: DatumT, rect: Rect) => {
        setTooltipState({ visible: true, datum, rect }, 500);
      },
      onMouseLeave: () => {
        setTooltipState((prev) => ({ ...prev, visible: false }), 0);
      },
      onFocus: (datum: DatumT, rect: Rect) => {
        setTooltipState({ visible: true, datum, rect }, 0);
      },
      onBlur: () => {
        setTooltipState((prev) => ({ ...prev, visible: false }), 0);
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
        animation: false,
        visible: tooltipState.visible,
        getReferenceClientRect: () => createVirtualReference(svgRef, tooltipState.rect!) as any,
        popperOptions,
        render: (attrs) => (
          <Tooltip {...attrs}>{tooltipState.datum && renderContent(tooltipState.datum)}</Tooltip>
        )
      } as TippyProps),
    [tooltipState, renderContent]
  );

  return [eventHandlers, { ref: svgRef }, tippyProps];
}
