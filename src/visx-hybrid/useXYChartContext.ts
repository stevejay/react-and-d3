import { useContext } from 'react';
import { isNil } from 'lodash-es';

import { XYChartContextType } from './types';
import { XYChartContext } from './XYChartContext';

export function useXYChartContext<Datum extends object, RenderingDatum extends object>() {
  const value = useContext(XYChartContext);
  if (isNil(value)) {
    throw new Error('No context value found for XYChartContext.');
  }
  return value as unknown as XYChartContextType<Datum, RenderingDatum>;
}
