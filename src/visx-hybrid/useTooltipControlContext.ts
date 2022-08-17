import { useContext } from 'react';
import { isNil } from 'lodash-es';

import { TooltipControlContext } from './TooltipControlContext';
import type { TooltipControlContextType } from './types';

export function useTooltipControlContext<Datum extends object>() {
  const value = useContext(TooltipControlContext);
  if (isNil(value)) {
    throw new Error('No context value found for TooltipControlContextType.');
  }
  return value as TooltipControlContextType<Datum>;
}
