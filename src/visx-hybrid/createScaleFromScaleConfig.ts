import type { AnyD3Scale, ScaleConfig, ScaleInput } from '@visx/scale';
// TODO visx/scale is enormous.
import { createScale } from '@visx/scale';
import { extent as d3Extent } from 'd3-array';
import { isNil } from 'lodash-es';

import { isDiscreteScaleConfig } from './isDiscreteScaleConfig';
import { scaleCanBeZeroed } from './scaleCanBeZeroed';
import type { AxisScaleOutput } from './types';

export function createScaleFromScaleConfig<Scale extends AnyD3Scale>(
  values: ScaleInput<Scale>[],
  scaleConfig?: ScaleConfig<AxisScaleOutput>,
  range?: [number, number]
) {
  // d3.extent returns NaN domain for empty arrays
  if (values.length === 0 || isNil(scaleConfig)) {
    return null;
  }

  const domain = isDiscreteScaleConfig(scaleConfig)
    ? values
    : (d3Extent(values) as [ScaleInput<Scale>, ScaleInput<Scale>]);

  return !isNil(domain) && 'zero' in scaleConfig && scaleConfig.zero === true && scaleCanBeZeroed(scaleConfig)
    ? createScale({ domain, range, zero: true, ...scaleConfig })
    : createScale({ domain: domain as [ScaleInput<Scale>, ScaleInput<Scale>], range, ...scaleConfig });
}
