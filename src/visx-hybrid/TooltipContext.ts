import { createContext } from 'react';

import type { TooltipContextType } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type InferTooltipContext<D extends object = any> = D extends TooltipContextType<infer D> ? D : any;

export const TooltipContext = createContext<InferTooltipContext>(null);
