// TODO:
// - two dependent axes?
// - resizable chart (drag handle).
import type { AxisScaleOutput } from '@visx/axis';
import { AnyD3Scale, createScale, ScaleConfig, ScaleInput } from '@visx/scale';
import { extent as d3Extent } from 'd3-array';
import { isNil } from 'lodash-es';

import { isDiscreteScaleConfig } from '@/visx-next/scale';
import { scaleCanBeZeroed } from '@/visx-next/scaleCanBeZeroed';

export function createScaleFromScaleConfig<Scale extends AnyD3Scale, Datum extends object>(
  entries: { data: readonly Datum[]; accessor: (d: Datum) => ScaleInput<Scale> }[],
  scaleConfig: ScaleConfig<AxisScaleOutput>,
  range?: [number, number]
) {
  //   type IndependentScaleInput = ScaleInput<Scale>;
  //   type DependentScaleInput = ScaleInput<DependentScale>;

  const values = entries.reduce<ScaleInput<Scale>[]>(
    (combined, entry) =>
      entry ? combined.concat(entry.data.map((d: Datum) => entry.accessor(d))) : combined,
    []
  );

  // d3.extent returns NaN domain for empty arrays
  if (values.length === 0) {
    return undefined;
  }

  const domain = isDiscreteScaleConfig(scaleConfig)
    ? values
    : (d3Extent(values) as [ScaleInput<Scale>, ScaleInput<Scale>]);

  return !isNil(domain) && 'zero' in scaleConfig && scaleConfig.zero === true && scaleCanBeZeroed(scaleConfig)
    ? createScale({
        domain, // as [ScaleInput<Scale>, ScaleInput<Scale>],
        range,
        zero: true,
        ...scaleConfig
      })
    : createScale({
        domain: domain as [ScaleInput<Scale>, ScaleInput<Scale>],
        range,
        ...scaleConfig
      });
}
