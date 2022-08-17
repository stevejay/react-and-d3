import { createContext } from 'react';

import type { TooltipControlContextType } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type InferTooltipControlContext<D extends object = any> = D extends TooltipControlContextType<infer D>
  ? D
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any;

export const TooltipControlContext = createContext<InferTooltipControlContext>(null);
