import { useContext } from 'react';

import { isNil } from './isNil';
import { TooltipVisibilityContext } from './TooltipVisibilityContext';
import type { ITooltipVisibilityContext } from './types';

export function useTooltipVisibilityContext<Datum extends object>() {
  const value = useContext(TooltipVisibilityContext);
  if (isNil(value)) {
    throw new Error('No context value found for ITooltipVisibilityContext.');
  }
  return value as ITooltipVisibilityContext<Datum>;
}
