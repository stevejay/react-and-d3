import { useContext } from 'react';

import { isNil } from './isNil';
import { TooltipStateContext } from './TooltipStateContext';
import type { TooltipStateContextType } from './types';

export function useTooltipStateContext<Datum extends object>() {
  const value = useContext(TooltipStateContext);
  if (isNil(value)) {
    throw new Error('No context value found for TooltipStateContextType.');
  }
  return value as TooltipStateContextType<Datum>;
}
