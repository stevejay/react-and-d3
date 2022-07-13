import { ReactNode } from 'react';
import { animated, useTransition } from 'react-spring';
import { easeCubicInOut } from 'd3-ease';

import { Portal } from './Portal';
import { TooltipState } from './useVirtualElementTooltip';

export interface TooltipProps<Datum> {
  tooltip: TooltipState<Datum>;
  className?: string;
  children: ReactNode;
}

export function Tooltip<Datum>({ tooltip, className = '', children }: TooltipProps<Datum>) {
  const transitions = useTransition(tooltip.isVisible, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, delay: 200 },
    config: { duration: 200, easing: easeCubicInOut }
  });
  return (
    <>
      {transitions(
        (styles, item) =>
          item && (
            <animated.div
              ref={tooltip.popperElement}
              style={{ ...styles, ...tooltip.styles.popper }}
              className={`text-slate-900 bg-slate-100 pointer-events-none px-3 py-1 shadow-md max-w-[280px] ${className}`}
              {...tooltip.attributes.popper}
              aria-hidden
            >
              {children}
            </animated.div>
          )
      )}
    </>
  );
}

export function TooltipInPortal<Datum>({ tooltip, className = '', children }: TooltipProps<Datum>) {
  const transitions = useTransition(tooltip.isVisible, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, delay: 200 },
    config: { duration: 200, easing: easeCubicInOut }
  });
  return (
    <>
      {transitions(
        (styles, item) =>
          item && (
            <Portal node={document && document.getElementById('portal-tooltip')}>
              <animated.div
                ref={tooltip.popperElement}
                style={{ ...styles, ...tooltip.styles.popper }}
                className={`text-slate-900 bg-slate-100 pointer-events-none px-3 py-1 shadow-md max-w-[280px] ${className}`}
                {...tooltip.attributes.popper}
                aria-hidden
              >
                {children}
              </animated.div>
            </Portal>
          )
      )}
    </>
  );
}
