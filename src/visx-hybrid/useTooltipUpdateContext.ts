import { useContext } from 'react';
import { isNil } from 'lodash-es';

import { TooltipUpdateContext } from './TooltipUpdateContext';
import type { TooltipUpdateContextType } from './types';

export function useTooltipUpdateContext<Datum extends object>() {
  const value = useContext(TooltipUpdateContext);
  if (isNil(value)) {
    throw new Error('No context value found for TooltipUpdateContextType.');
  }
  return value as TooltipUpdateContextType<Datum>;
}
