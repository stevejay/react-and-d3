import { createContext } from 'react';

import type { TooltipUpdateContextType } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type InferTooltipUpdateContext<D extends object = any> = D extends TooltipUpdateContextType<infer D>
  ? D
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any;

export const TooltipUpdateContext = createContext<InferTooltipUpdateContext>(null);
