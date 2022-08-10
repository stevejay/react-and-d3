import { useContext } from 'react';
import { isNil } from 'lodash-es';

import { TooltipContext } from './TooltipContext';
import type { TooltipContextType } from './types';

export function useTooltipContext<Datum extends object>() {
  const value = useContext(TooltipContext);
  if (isNil(value)) {
    throw new Error('No context value found for TooltipContext.');
  }
  return value as TooltipContextType<Datum>;
}
