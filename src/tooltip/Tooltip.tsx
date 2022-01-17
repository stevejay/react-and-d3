import { FC } from 'react';
import { animated, SpringValues } from '@react-spring/web';
import type { TippyProps } from '@tippyjs/react/headless';

import './Tooltip.css';

type TooltipArrowProps = Parameters<NonNullable<TippyProps['render']>>[0];

const TooltipArrow: FC<TooltipArrowProps> = (props) => (
  <div data-popper-arrow {...props} className="tooltip-arrow" />
);

export type TooltipProps = Parameters<NonNullable<TippyProps['render']>>[0] & {
  ariaHidden?: boolean;
  styles?: SpringValues;
};

export const Tooltip: FC<TooltipProps> = ({ ariaHidden = false, styles, children, ...rest }) => (
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
