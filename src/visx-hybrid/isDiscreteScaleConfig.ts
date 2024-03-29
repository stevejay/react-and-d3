import type { ScaleConfig } from '@visx/scale';

import type { AxisScaleOutput } from './types';

// From @visx/xychart
// https://github.com/airbnb/visx/blob/42d3213fe5286388fc456eade9b3874d096616aa/packages/visx-xychart/src/utils/isDiscreteScale.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDiscreteScaleConfig(scaleConfig: ScaleConfig<AxisScaleOutput, any, any>) {
  return scaleConfig?.type === 'band' || scaleConfig?.type === 'ordinal' || scaleConfig?.type === 'point';
}
