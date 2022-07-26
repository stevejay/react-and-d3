// TODO:
// - two dependent axes?
// - resizable chart (drag handle).
import { SVGProps, useContext } from 'react';
import { SpringConfig } from 'react-spring';
import type { AxisScaleOutput } from '@visx/axis';
import { ScaleConfig } from '@visx/scale';
import { isNil } from 'lodash-es';

import { XYCHART_EVENT_SOURCE } from '@/visx-next/eventSources';
import { ParentSize } from '@/visx-next/ParentSize';
import { Margin } from '@/visx-next/types';

import { defaultSpringConfig } from './constants';
import { createScaleFromScaleConfig } from './createScaleFromScaleConfig';
import { DataContext } from './DataContext';
import { EventEmitterContext, EventEmitterProvider } from './EventEmitterProvider';
import { getDataEntriesFromChildren } from './getDataEntriesFromChildren';
import { TooltipContext } from './TooltipContext';
import { TooltipProvider } from './TooltipProvider';
import { useEventEmitters } from './useEventEmitters';
// import { SVGAxis } from './SVGAxis';
// import { SVGGrid } from './SVGGrid';
// import { SVGXYChartConfig } from './types';

// XScale extends AxisScale, YScale extends AxisScale

// eslint-disable-next-line @typescript-eslint/no-explicit-any
//   type XScale = ScaleConfigToD3Scale<IndependentScaleConfig, AxisScaleOutput, any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
//   type YScale = ScaleConfigToD3Scale<DependentScaleConfig, AxisScaleOutput, any, any>;

const defaultMargin: Margin = { left: 0, right: 0, top: 0, bottom: 0 };

type SVGXYChartProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>
  // Datum extends object
> = {
  width?: number;
  height?: number;
  parentSizeDebounceMs?: number;
  /** Margin to apply around the chart. */
  margin?: Margin;
  /** If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as the xScale config. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  independentScale: IndependentScaleConfig;
  /** If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as the yScale config. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependentScale: DependentScaleConfig;
  /** If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as horizontal. */
  horizontal?: boolean;
  animate?: boolean;
  /**
   * A react-spring configuration object.
   * If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as springConfig.
   * If provided, must be a stable object.
   */
  springConfig?: SpringConfig;
  renderingOffset?: number;
  independentRangePadding?: number;
  dependentRangePadding?: number;
  captureEvents?: boolean;
  hideTooltipDebounceMs?: number;
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>;

export function SVGXYChart<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>
  // Datum extends object
>(props: SVGXYChartProps<IndependentScaleConfig, DependentScaleConfig>) {
  const { width, height, parentSizeDebounceMs = 300, hideTooltipDebounceMs = 400 } = props;
  const emitter = useContext(EventEmitterContext);
  const tooltipContext = useContext(TooltipContext);

  if (isNil(tooltipContext)) {
    return (
      <TooltipProvider hideTooltipDebounceMs={hideTooltipDebounceMs}>
        <SVGXYChart {...props} />
      </TooltipProvider>
    );
  }

  if (isNil(width) || isNil(height)) {
    // If hardcoded dimensions are not available, wrap self in ParentSize.
    return (
      <ParentSize debouncedMeasureWaitMs={parentSizeDebounceMs}>
        {(dimensions) => <SVGXYChart {...props} width={dimensions.width} height={dimensions.height} />}
      </ParentSize>
    );
  }

  // EventEmitterProvider should be the last wrapper so we do not duplicate handlers
  if (isNil(emitter)) {
    return (
      <EventEmitterProvider>
        <SVGXYChart {...props} />
      </EventEmitterProvider>
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
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>
  // Datum extends object
>({
  width,
  height,
  independentScale: independentScaleConfig,
  dependentScale: dependentScaleConfig,
  margin = defaultMargin,
  horizontal = false,
  animate = true,
  springConfig = defaultSpringConfig,
  renderingOffset = 0,
  independentRangePadding = 0,
  dependentRangePadding = 0,
  captureEvents = true,
  children,
  ...svgProps
}: SVGXYChartProps<IndependentScaleConfig, DependentScaleConfig> & {
  width: number;
  height: number;
}) {
  const dataEntries = getDataEntriesFromChildren(children, horizontal);
  // console.log(dataEntries);

  // Calculate scales.
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  const independentRange: [number, number] = horizontal
    ? [Math.max(0, height - margin.bottom - independentRangePadding), margin.top + independentRangePadding]
    : [margin.left + independentRangePadding, Math.max(0, width - margin.right - independentRangePadding)];
  const dependentRange: [number, number] = horizontal
    ? [margin.left + dependentRangePadding, Math.max(0, width - margin.right - dependentRangePadding)]
    : [Math.max(0, height - margin.bottom - dependentRangePadding), margin.top + dependentRangePadding];
  const independentScale = createScaleFromScaleConfig(
    dataEntries.map((entry) => ({ accessor: entry.independentAccessor, data: entry.data })),
    independentScaleConfig,
    independentRange
  );
  const dependentScale = createScaleFromScaleConfig(
    dataEntries.map((entry) => ({ accessor: entry.dependentAccessor, data: entry.data })),
    dependentScaleConfig,
    dependentRange
  );

  // Returns event handlers to be applied to the <rect> that is for capturing events.
  // Each handler just emits the event.
  const eventEmitters = useEventEmitters({ source: XYCHART_EVENT_SOURCE });

  // TODO this happens if the combined domain for an axis is empty.
  if (isNil(independentScale) || isNil(dependentScale)) {
    console.log('fastreturning in SVGXYChart');
    return null;
  }

  const value = {
    independentScale,
    dependentScale,
    independentRangePadding,
    dependentRangePadding,
    width,
    height,
    innerWidth,
    innerHeight,
    margin,
    dataEntries,
    horizontal,
    animate,
    springConfig,
    renderingOffset
  };

  console.log('XY hybrid render');

  return width && width > 0 && height && height > 0 ? (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} {...svgProps}>
      <DataContext.Provider value={value}>{children}</DataContext.Provider>
      {captureEvents && (
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
          fill="transparent"
          role="presentation"
          aria-hidden
          {...eventEmitters}
        />
      )}
    </svg>
  ) : null;

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

  // const {
  //   margin,
  //   horizontal = false,
  //   independentRangePadding = 0,
  //   dependentRangePadding = 0,
  //   springConfig = defaultSpringConfig,
  //   animate = true
  // } = config;
  // const innerWidth = Math.max(0, width - margin.left - margin.right);
  // const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // const independentRange: [number, number] = horizontal
  //   ? [Math.max(0, height - margin.bottom - independentRangePadding), margin.top + independentRangePadding]
  //   : [margin.left + independentRangePadding, Math.max(0, width - margin.right - independentRangePadding)];

  // const dependentRange: [number, number] = horizontal
  //   ? [margin.left + dependentRangePadding, Math.max(0, width - margin.right - dependentRangePadding)]
  //   : [Math.max(0, height - margin.bottom - dependentRangePadding), margin.top + dependentRangePadding];

  // const independentScale = createInitialScaleFromScaleConfig(
  //   config.series.map((x) => ({ accessor: x.independentAccessor, data: x.data })),
  //   config.independentScale,
  //   independentRange
  // );

  // const dependentScale = createInitialScaleFromScaleConfig(
  //   config.series.map((x) => ({ accessor: x.dependentAccessor, data: x.data })),
  //   config.dependentScale,
  //   dependentRange
  // );

  // //   const independentAxisTicks = getTicksData(independentScale, config.independentAxis);
  // //   //   const independentAxisRect =

  // //   const dependentAxisTicks = getTicksData(dependentScale, config.dependentAxis);

  // //   console.log('foo', independentAxisTicks, dependentAxisTicks);

  // return (
  //   <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} {...rest}>
  //     {independentScale && config.independentGrid && (
  //       <SVGGrid
  //         variableType="independent"
  //         scale={independentScale}
  //         gridConfig={config.independentGrid}
  //         horizontal={horizontal}
  //         // width={width}
  //         // height={height}
  //         innerWidth={innerWidth}
  //         innerHeight={innerHeight}
  //         margin={margin}
  //         // rangePadding={independentRangePadding}
  //         springConfig={springConfig}
  //         animate={animate}
  //       />
  //     )}
  //     {dependentScale && config.dependentGrid && (
  //       <SVGGrid
  //         variableType="dependent"
  //         scale={dependentScale}
  //         gridConfig={config.dependentGrid}
  //         horizontal={horizontal}
  //         // width={width}
  //         // height={height}
  //         innerWidth={innerWidth}
  //         innerHeight={innerHeight}
  //         margin={margin}
  //         // rangePadding={dependentRangePadding}
  //         springConfig={springConfig}
  //         animate={animate}
  //       />
  //     )}
  //     {independentScale && config.independentAxis && (
  //       <SVGAxis
  //         variableType="independent"
  //         scale={independentScale}
  //         axisConfig={config.independentAxis}
  //         horizontal={horizontal}
  //         width={width}
  //         height={height}
  //         margin={margin}
  //         rangePadding={independentRangePadding}
  //         springConfig={springConfig}
  //         animate={animate}
  //       />
  //     )}
  //     {dependentScale && config.dependentAxis && (
  //       <SVGAxis
  //         variableType="dependent"
  //         scale={dependentScale}
  //         axisConfig={config.dependentAxis}
  //         horizontal={horizontal}
  //         width={width}
  //         height={height}
  //         margin={margin}
  //         rangePadding={dependentRangePadding}
  //         springConfig={springConfig}
  //         animate={animate}
  //       />
  //     )}
  //   </svg>
  // );
}
