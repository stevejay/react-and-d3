import { FC } from 'react';
import type { TippyProps } from '@tippyjs/react/headless';

import './TooltipArrow.css';

export type TooltipArrowProps = Parameters<NonNullable<TippyProps['render']>>[0];

export const TooltipArrow: FC<TooltipArrowProps> = (props) => (
  <div data-popper-arrow {...props} className="tooltip-arrow" />
);
