import { useContext } from 'react';
import { isNil } from 'lodash-es';

import { IXYChartContext } from './types';
import { XYChartContext } from './XYChartContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useXYChartContext<Datum extends object, RenderingDatum extends object = any>() {
  const value = useContext(XYChartContext);
  if (isNil(value)) {
    throw new Error('No context value found for XYChartContext.');
  }
  return value as unknown as IXYChartContext<Datum, RenderingDatum>;
}
