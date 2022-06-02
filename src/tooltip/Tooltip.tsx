import { ReactNode } from 'react';
import { animated, SpringValues } from 'react-spring';
import type { TippyProps } from '@tippyjs/react/headless';

import './Tooltip.css';

type TooltipArrowProps = Parameters<NonNullable<TippyProps['render']>>[0];

function TooltipArrow(props: TooltipArrowProps) {
  return <div data-popper-arrow {...props} className="tooltip-arrow" />;
}

export type TooltipProps = Parameters<NonNullable<TippyProps['render']>>[0] & {
  ariaHidden?: boolean;
  styles?: SpringValues;
  children: ReactNode;
};

export function Tooltip({ ariaHidden = false, styles, children, ...rest }: TooltipProps) {
  return (
    <animated.div
      {...rest}
      style={styles}
      aria-hidden={ariaHidden}
      className="max-w-xs p-2 text-base text-left border rounded shadow-sm opacity-0 select-none border-slate-600 bg-slate-900"
    >
      {children}
      <TooltipArrow {...rest} />
    </animated.div>
  );
}
