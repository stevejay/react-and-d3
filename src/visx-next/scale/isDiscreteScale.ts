import { AxisScaleOutput } from '@visx/axis';
import { ScaleConfig } from '@visx/scale';

// From @visx/xychart
// https://github.com/airbnb/visx/blob/42d3213fe5286388fc456eade9b3874d096616aa/packages/visx-xychart/src/utils/isDiscreteScale.ts
export function isDiscreteScaleConfig(scaleConfig: ScaleConfig<AxisScaleOutput, any, any>) {
  return scaleConfig?.type === 'band' || scaleConfig?.type === 'ordinal' || scaleConfig?.type === 'point';
}
