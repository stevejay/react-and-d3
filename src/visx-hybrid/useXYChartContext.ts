import { useContext } from 'react';
import { isNil } from 'lodash-es';

import { XYChartContext } from './XYChartContext';

export function useXYChartContext() {
  const value = useContext(XYChartContext);
  if (isNil(value)) {
    throw new Error('No context value found for XYChartContext.');
  }
  return value;
}
