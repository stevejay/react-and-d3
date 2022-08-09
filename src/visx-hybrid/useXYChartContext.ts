import { useContext } from 'react';
import { isNil } from 'lodash-es';

import { DataContext } from './DataContext';

export function useXYChartContext() {
  const value = useContext(DataContext);
  if (isNil(value)) {
    throw new Error('No context value found for DataContext.');
  }
  return value;
}
