// TODO:
// - two dependent axes?
// - resizable chart (drag handle).
import type { SVGProps } from 'react';
import type { AxisScaleOutput } from '@visx/axis';
import { AnyD3Scale, createScale, ScaleConfig, ScaleInput } from '@visx/scale';
import { extent as d3Extent } from 'd3-array';
import { isNil } from 'lodash-es';

import { ParentSize } from '@/visx-next/ParentSize';
import { isDiscreteScaleConfig } from '@/visx-next/scale';
import { scaleCanBeZeroed } from '@/visx-next/scaleCanBeZeroed';

import { defaultSpringConfig } from './constants';
import { SVGAxis } from './SVGAxis';
import { SVGGrid } from './SVGGrid';
import { SVGXYChartConfig } from './types';

// XScale extends AxisScale, YScale extends AxisScale

// eslint-disable-next-line @typescript-eslint/no-explicit-any
//   type XScale = ScaleConfigToD3Scale<IndependentScaleConfig, AxisScaleOutput, any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
//   type YScale = ScaleConfigToD3Scale<DependentScaleConfig, AxisScaleOutput, any, any>;

type SVGXYChartProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object
> = {
  config: SVGXYChartConfig<IndependentScaleConfig, DependentScaleConfig, Datum>;
  //   initialWidth?: number;
  //   initialHeight?: number;
  width?: number;
  height?: number;
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>;

export function SVGXYChart<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object
>(props: SVGXYChartProps<IndependentScaleConfig, DependentScaleConfig, Datum>) {
  const {
    width,
    height,
    config: { parentSizeDebounceMs = 300 }
  } = props;

  //   if (!isNil(initialWidth) && !isNil(initialHeight)) {
  //     // If an initial size is available, wrap self in
  //   } else
  if (isNil(width) || isNil(height)) {
    // If hardcoded dimensions are not available, wrap self in ParentSize.
    return (
      <ParentSize debouncedMeasureWaitMs={parentSizeDebounceMs}>
        {(dimensions) => <SVGXYChart {...props} width={dimensions.width} height={dimensions.height} />}
      </ParentSize>
    );
  }

  return width && width > 0 && height && height > 0 ? (
    <InnerChart {...props} width={width} height={height} />
  ) : null;
}

function InnerChart<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object
>({
  config,
  width,
  height,
  ...rest
}: SVGXYChartProps<IndependentScaleConfig, DependentScaleConfig, Datum> & {
  width: number;
  height: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   type IndependentScale = ScaleConfigToD3Scale<IndependentScaleConfig, AxisScaleOutput, any, any>;
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   type DependentScale = ScaleConfigToD3Scale<DependentScaleConfig, AxisScaleOutput, any, any>;

  // Create mapped internal data.
  // Calculate combined domain.

  //   const domains = getAxesDomainExtents(
  //     config.series,
  //     config.independentAxis.scale,
  //     config.dependentAxis.scale
  //   );

  //   const [{ width, height, margin }, setDimensions] = useDimensions(initialDimensions);

  const {
    margin,
    horizontal = false,
    independentRangePadding = 0,
    dependentRangePadding = 0,
    springConfig = defaultSpringConfig,
    animate = true
  } = config;
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const independentRange: [number, number] = horizontal
    ? [Math.max(0, height - margin.bottom - independentRangePadding), margin.top + independentRangePadding]
    : [margin.left + independentRangePadding, Math.max(0, width - margin.right - independentRangePadding)];

  const dependentRange: [number, number] = horizontal
    ? [margin.left + dependentRangePadding, Math.max(0, width - margin.right - dependentRangePadding)]
    : [Math.max(0, height - margin.bottom - dependentRangePadding), margin.top + dependentRangePadding];

  const independentScale = createInitialScaleFromScaleConfig(
    config.series.map((x) => ({ accessor: x.independentAccessor, data: x.data })),
    config.independentScale,
    independentRange
  );

  const dependentScale = createInitialScaleFromScaleConfig(
    config.series.map((x) => ({ accessor: x.dependentAccessor, data: x.data })),
    config.dependentScale,
    dependentRange
  );

  //   const independentAxisTicks = getTicksData(independentScale, config.independentAxis);
  //   //   const independentAxisRect =

  //   const dependentAxisTicks = getTicksData(dependentScale, config.dependentAxis);

  //   console.log('foo', independentAxisTicks, dependentAxisTicks);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} {...rest}>
      {independentScale && config.independentGrid && (
        <SVGGrid
          variableType="independent"
          scale={independentScale}
          gridConfig={config.independentGrid}
          horizontal={horizontal}
          // width={width}
          // height={height}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          margin={margin}
          // rangePadding={independentRangePadding}
          springConfig={springConfig}
          animate={animate}
        />
      )}
      {dependentScale && config.dependentGrid && (
        <SVGGrid
          variableType="dependent"
          scale={dependentScale}
          gridConfig={config.dependentGrid}
          horizontal={horizontal}
          // width={width}
          // height={height}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          margin={margin}
          // rangePadding={dependentRangePadding}
          springConfig={springConfig}
          animate={animate}
        />
      )}
      {independentScale && config.independentAxis && (
        <SVGAxis
          variableType="independent"
          scale={independentScale}
          axisConfig={config.independentAxis}
          horizontal={horizontal}
          width={width}
          height={height}
          margin={margin}
          rangePadding={independentRangePadding}
          springConfig={springConfig}
          animate={animate}
        />
      )}
      {dependentScale && config.dependentAxis && (
        <SVGAxis
          variableType="dependent"
          scale={dependentScale}
          axisConfig={config.dependentAxis}
          horizontal={horizontal}
          width={width}
          height={height}
          margin={margin}
          rangePadding={dependentRangePadding}
          springConfig={springConfig}
          animate={animate}
        />
      )}
    </svg>
  );
}

// function applyTickFormat<Value>(tickFormatter: TickFormatter<Value>, values: Value[]) {
//   const mappedValues = values.map((value, index) => ({ value, index }));
//   return mappedValues.map(({ value, index }) => tickFormatter(value, index, mappedValues));
// }

// Will not yet have the correct range.
function createInitialScaleFromScaleConfig<Scale extends AnyD3Scale, Datum extends object>(
  entries: { data: Datum[]; accessor: (d: Datum) => ScaleInput<Scale> }[],
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
