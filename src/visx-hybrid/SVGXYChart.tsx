import type { SVGProps } from 'react';
import { animated, SpringConfig, useTransition } from 'react-spring';
import { createScale } from '@visx/scale';
import { isNil } from 'lodash-es';

import { calculateAutoMarginFromChildren } from './calculateAutoMarginFromChildren';
import {
  defaultHideTooltipDebounceMs,
  defaultParentSizeDebounceMs,
  defaultSpringConfig,
  defaultTheme,
  XYCHART_EVENT_SOURCE
} from './constants';
import { createScaleFromScaleConfig } from './createScaleFromScaleConfig';
import { DataContext, InferDataContext } from './DataContext';
import { DataEntryStore } from './DataEntryStore';
import { EventEmitterProvider } from './EventEmitterProvider';
import { getDataEntriesFromChildren } from './getDataEntriesFromChildren';
import { getScaleBandwidth } from './getScaleBandwidth';
import { ParentSize } from './ParentSize';
import { TooltipProvider } from './TooltipProvider';
import type { AxisScaleOutput, Margin, ScaleConfig, XYChartTheme } from './types';
import { useEventEmitters } from './useEventEmitters';

// TODO:
// - Support two dependent axes?

interface SVGXYChartOwnProps<
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput>
> {
  /** The width of the chart. Optional. If either of `width` or `height` are not given then the chart will wrap itself in a `ParentSize` component. */
  width?: number;
  /** The height of the chart. Optional. If either of `width` or `height` are not given then the chart will wrap itself in a `ParentSize` component. */
  height?: number;
  /** The debounce value (in milliseconds) to use for the `ParentSize` component that is added when `width` or `height` are not given. Optional. Defaults to 300ms. */
  parentSizeDebounceMs?: number;
  /** Margin to apply around the chart. Optional. If not given then an auto margin will be calculated. */
  margin?: Margin;
  /** The configuration object for the independent scale. This should be a stable object. */
  independentScale: IndependentScaleConfig;
  /** The configuration object for the dependent scale. This should be a stable object. */
  dependentScale: DependentScaleConfig;
  /** By default the chart has the independent scale as the x-axis and the dependent scale as the y-axis. Set `horizontal` to `true` to switch this around. Optional. */
  horizontal?: boolean;
  /** A value in pixels for adding padding to the start and end of the independent axis. Optional. Defaults to `0`. */
  independentRangePadding?: number; // TODO support [number, number]
  /** A value in pixels for adding padding to the start and end of the dependent axis. Optional. Defaults to `0`. */
  dependentRangePadding?: number; // TODO support [number, number]
  /** Enables or disables animation for the entire chart. Optional. Defaults to `true`. */
  animate?: boolean;
  /** Whether the SVG should be animated to fade in when mounted and fade out when there is no data. Optional. Defaults to `true`. */
  animateSVG?: boolean;
  /** A react-spring configuration object to use as the default for the entire chart. Optional. A default time-based configuration is used as the default if none is given. This should be a stable object. */
  springConfig?: SpringConfig;
  /** An offset value in pixels that can be used to improve rendering on non-retina displays. Optional. */
  renderingOffset?: number;
  /** Whether or not the chart should be interactive. Optional. Defaults to `true`. */
  captureEvents?: boolean;
  /** The debounce value (in milliseconds) to continue to show the tooltip for when it should be hidden. Defaults to 400ms. */
  hideTooltipDebounceMs?: number;
  /** A custom theme for the chart. Optional. If not given then a default theme is applied. This should be a stable object. */
  theme?: XYChartTheme;
}

export type SVGXYChartProps<
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput>
> = SVGXYChartOwnProps<IndependentScaleConfig, DependentScaleConfig> &
  Omit<
    Omit<SVGProps<SVGSVGElement>, keyof SVGXYChartOwnProps<IndependentScaleConfig, DependentScaleConfig>>,
    'ref'
  >;

/** The root component for the XY chart. */
export function SVGXYChart<
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput>
>(props: SVGXYChartProps<IndependentScaleConfig, DependentScaleConfig>) {
  const {
    width,
    height,
    parentSizeDebounceMs = defaultParentSizeDebounceMs,
    hideTooltipDebounceMs = defaultHideTooltipDebounceMs
  } = props;

  if (isNil(width) || isNil(height)) {
    // If hardcoded dimensions are not available then wrap self in ParentSize.
    return (
      <ParentSize debouncedMeasureWaitMs={parentSizeDebounceMs}>
        {(dimensions) => <SVGXYChart {...props} width={dimensions.width} height={dimensions.height} />}
      </ParentSize>
    );
  }

  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <TooltipProvider hideTooltipDebounceMs={hideTooltipDebounceMs}>
      <EventEmitterProvider>
        <InnerChart {...props} width={width} height={height} />
      </EventEmitterProvider>
    </TooltipProvider>
  );
}

function InnerChart<
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput>
>({
  width = 0,
  height = 0,
  independentScale: independentScaleConfig,
  dependentScale: dependentScaleConfig,
  independentRangePadding = 0,
  dependentRangePadding = 0,
  margin: userMargin,
  horizontal = false,
  animate = true,
  animateSVG = true,
  springConfig = defaultSpringConfig,
  renderingOffset = 0,
  captureEvents = true,
  theme = defaultTheme,
  children,
  ...svgProps
}: SVGXYChartProps<IndependentScaleConfig, DependentScaleConfig>) {
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // type IndependentScale = ScaleConfigToD3Scale<IndependentScaleConfig, AxisScaleOutput, any, any>;
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // type DependentScale = ScaleConfigToD3Scale<DependentScaleConfig, AxisScaleOutput, any, any>;

  // Gather all the series data from the chart's child components:
  const { dataEntries, newDataEntries, groupScales } = getDataEntriesFromChildren(children, horizontal);

  const newIndependentDomainValues = newDataEntries
    .map((dataEntry) => dataEntry.getIndependentDomainValues())
    .flat();
  const newDependentDomainValues = newDataEntries
    .map((dataEntry) => dataEntry.getDependentDomainValues())
    .flat();

  // Create the scales, each with a composite domain derived from all the series data.
  const independentScale = createScaleFromScaleConfig(newIndependentDomainValues, independentScaleConfig);
  const dependentScale = createScaleFromScaleConfig(newDependentDomainValues, dependentScaleConfig);

  // Create a fallback color scale for coloring each series:
  const colorScale = createScale({
    type: 'ordinal',
    domain: newDataEntries.map((entry) => entry.dataKey),
    range: theme.colors as string[]
  });

  // Returns event handlers to be applied to the <rect> that is for capturing events.
  // Each handler just emits the event.
  const eventEmitters = useEventEmitters({ source: XYCHART_EVENT_SOURCE });

  // A scale will be undefined if the combined domain for a scale is empty.
  // if (isNil(independentScale) || isNil(dependentScale)) {
  //   return null;
  // }

  let dataContextValue: InferDataContext | null = null;
  const hasValidContent = !isNil(independentScale) && !isNil(dependentScale) && width > 0 && height > 0;

  if (hasValidContent) {
    // Use the given margin object or calculate it automatically:
    const margin =
      userMargin ??
      calculateAutoMarginFromChildren({
        children,
        horizontal,
        independentScale,
        dependentScale,
        independentRangePadding,
        dependentRangePadding,
        theme
      });

    // Now that we know the margin to use, calculate the range for each scale:

    const independentRange: [number, number] = horizontal
      ? [Math.max(0, height - margin.bottom - independentRangePadding), margin.top + independentRangePadding]
      : [margin.left + independentRangePadding, Math.max(0, width - margin.right - independentRangePadding)];

    const dependentRange: [number, number] = horizontal
      ? [margin.left + dependentRangePadding, Math.max(0, width - margin.right - dependentRangePadding)]
      : [Math.max(0, height - margin.bottom - dependentRangePadding), margin.top + dependentRangePadding];

    // Update the scales with those calculated ranges:
    independentScale.range(independentRange);
    dependentScale.range(dependentRange);
    groupScales.forEach((groupScale) => groupScale.range([0, getScaleBandwidth(independentScale)]));

    // Calculate the size of the chart area:
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - margin.top - margin.bottom);

    dataContextValue = {
      scales: {
        independent: independentScale,
        dependent: dependentScale,
        group: groupScales,
        color: colorScale
      },
      independentScale,
      dependentScale,
      groupScales,
      colorScale,
      independentRangePadding,
      dependentRangePadding,
      width,
      height,
      innerWidth,
      innerHeight,
      margin,
      dataEntries,
      dataEntryStore: new DataEntryStore(newDataEntries),
      horizontal,
      animate,
      springConfig,
      renderingOffset,
      theme
    };
  }

  const { style, className = '', ...restSvgProps } = svgProps;

  const transitions = useTransition(dataContextValue, {
    initial: { opacity: 0 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    update: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig,
    key: Boolean(dataContextValue),
    immediate: !(animate && animateSVG)
  });

  return (
    <>
      {transitions(({ opacity }, value) =>
        value ? (
          <animated.svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            style={{ ...theme?.svg?.style, ...style, opacity }}
            className={`${className} ${theme?.svg?.className ?? ''}`}
            {...restSvgProps}
          >
            <DataContext.Provider value={value}>{children}</DataContext.Provider>
            {captureEvents && (
              <rect
                x={value.margin.left}
                y={value.margin.top}
                width={width - value.margin.left - value.margin.right}
                height={height - value.margin.top - value.margin.bottom}
                fill="transparent"
                role="presentation"
                aria-hidden
                {...eventEmitters}
              />
            )}
          </animated.svg>
        ) : null
      )}
    </>
  );

  // return (
  //   <svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     width={width}
  //     height={height}
  //     style={{ ...theme?.svg?.styles, ...style }}
  //     className={`${className} ${theme?.svg?.className ?? ''}`}
  //     {...restSvgProps}
  //   >
  //     {hasValidContent && dataContextValue && (
  //       <>
  //         <DataContext.Provider value={dataContextValue}>{children}</DataContext.Provider>
  //         {captureEvents && (
  //           <rect
  //             x={dataContextValue.margin.left}
  //             y={dataContextValue.margin.top}
  //             width={width - dataContextValue.margin.left - dataContextValue.margin.right}
  //             height={height - dataContextValue.margin.top - dataContextValue.margin.bottom}
  //             fill="transparent"
  //             role="presentation"
  //             aria-hidden
  //             {...eventEmitters}
  //           />
  //         )}
  //       </>
  //     )}
  //   </svg>
  // );
}
