import { FC } from 'react';
import type { TippyProps } from '@tippyjs/react';

import './Tooltip.css';

export type TooltipArrowProps = Parameters<NonNullable<TippyProps['render']>>[0];

export const TooltipArrow: FC<TooltipArrowProps> = (props) => (
  <div data-popper-arrow {...props} className="tooltip-arrow" />
);

export type TooltipProps = Parameters<NonNullable<TippyProps['render']>>[0] & {
  ariaHidden?: boolean;
};

export const Tooltip: FC<TooltipProps> = ({ ariaHidden = false, children, ...rest }) => (
  <div
    {...rest}
    // style={{ opacity }}
    aria-hidden={ariaHidden}
    className="max-w-xs p-2 text-xs leading-tight text-left border rounded shadow-sm select-none border-slate-600 bg-slate-900"
  >
    {children}
    <TooltipArrow {...rest} />
  </div>
);
