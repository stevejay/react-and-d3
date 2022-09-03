import { createContext } from 'react';

import type { TooltipStateContextType } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type InferTooltipStateContext<D extends object = any> = D extends TooltipStateContextType<infer D> ? D : any;

export const TooltipStateContext = createContext<InferTooltipStateContext>(null);
