import { createContext } from 'react';

import type { ITooltipVisibilityContext } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type InferTooltipVisibilityContext<D extends object = any> = D extends ITooltipVisibilityContext<infer D>
  ? D
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any;

export const TooltipVisibilityContext = createContext<InferTooltipVisibilityContext>(null);
