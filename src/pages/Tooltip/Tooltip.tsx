import { FC } from 'react';
import type { TippyProps } from '@tippyjs/react';
import { motion, MotionStyle } from 'framer-motion';

import './Tooltip.css';

type TooltipArrowProps = Parameters<NonNullable<TippyProps['render']>>[0];

const TooltipArrow: FC<TooltipArrowProps> = (props) => (
  <div data-popper-arrow {...props} className="tooltip-arrow" />
);

export type TooltipProps = Parameters<NonNullable<TippyProps['render']>>[0] & {
  ariaHidden?: boolean;
  style?: MotionStyle;
};

export const Tooltip: FC<TooltipProps> = ({ ariaHidden = false, style, children, ...rest }) => (
  <motion.div
    {...rest}
    style={style}
    aria-hidden={ariaHidden}
    className="max-w-xs p-2 text-base leading-tight text-left border rounded shadow-sm opacity-0 select-none border-slate-600 bg-slate-900"
  >
    {children}
    <TooltipArrow {...rest} />
  </motion.div>
);
