import type { SVGProps } from 'react';
import { animated, SpringConfig, useTransition } from 'react-spring';
import { createScale } from '@visx/scale';

import { addMargins } from './addMargins';
import { calculateAutoMarginFromChildren } from './calculateAutoMarginFromChildren';
import { ChartDimensions } from './ChartDimensions';
import {
  defaultHideTooltipDebounceMs,
  defaultParentSizeDebounceMs,
  defaultSpringConfig,
  defaultTheme,
  xyChartEventSource,
  zeroMargin,
  zeroRangePadding
} from './constants';
import { createScaleFromScaleConfig } from './createScaleFromScaleConfig';
import { DataEntryStore } from './DataEntryStore';
import { EventEmitterProvider } from './EventEmitterProvider';
import { getDataEntriesFromChildren } from './getDataEntriesFromChildren';
import { getDependentRange, getIndependentRange } from './getRange';
import { getScaleBandwidth } from './getScaleBandwidth';
import { isNil } from './isNil';
import { ParentSize } from './ParentSize';
import { ScaleSet } from './ScaleSet';
import { TooltipProvider } from './TooltipProvider';
import type { AxisScaleOutput, IXYChartContext, IXYChartTheme, Margin, ScaleConfig } from './types';
import { useEventEmitters } from './useEventEmitters';
import { XYChartContext } from './XYChartContext';

function resolveRangePadding(rangePadding: number | [number, number]): [number, number] {
  return typeof rangePadding === 'number' ? [rangePadding, rangePadding] : rangePadding;
}

interface SVGXYChartOwnProps<
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  AlternateDependentScaleConfig extends ScaleConfig<AxisScaleOutput>
> {
  /** The width of the chart. Optional. If either of `width` or `height` are not given then the chart will wrap itself in a `ParentSize` component. */
  width?: number;
  /** The height of the chart. Optional. If either of `width` or `height` are not given then the chart will wrap itself in a `ParentSize` component. */
  height?: number;
  /** The debounce value (in milliseconds) to use for the `ParentSize` component that is added when `width` or `height` are not given. Optional. Defaults to 300ms. */
  parentSizeDebounceMs?: number;
  /** Margin to apply around the chart itself. Optional. If not given then an auto margin will be calculated. */
  margin?: Margin;
  outerMargin?: number | Margin;
  /** The configuration object for the independent scale. This should be a stable object. */
  independentScale: IndependentScaleConfig;
  /** The configuration object for the dependent scale. This should be a stable object. */
  dependentScale: DependentScaleConfig;
  /** The configuration object for the alternate dependent scale. This should be a stable object. Optional. */
  alternateDependentScale?: AlternateDependentScaleConfig;
  /** By default the chart has the independent scale as the x-axis and the dependent scale as the y-axis. Set `horizontal` to `true` to switch this around. Optional. */
  horizontal?: boolean;
  /** A value in pixels for adding padding to the start and end of the independent axis. Optional. Defaults to `0`. */
  independentRangePadding?: number | [number, number];
  /** A value in pixels for adding padding to the start and end of the dependent axis. Optional. Defaults to `0`. */
  dependentRangePadding?: number | [number, number];
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

  persistentTooltipBehaviour?: boolean;
  /** A custom theme for the chart. Optional. If not given then a default theme is applied. This should be a stable object. */
  theme?: IXYChartTheme;
}

export type SVGXYChartProps<
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  AlternateDependentScaleConfig extends ScaleConfig<AxisScaleOutput>
> = SVGXYChartOwnProps<IndependentScaleConfig, DependentScaleConfig, AlternateDependentScaleConfig> &
  Omit<
    Omit<
      SVGProps<SVGSVGElement>,
      keyof SVGXYChartOwnProps<IndependentScaleConfig, DependentScaleConfig, AlternateDependentScaleConfig>
    >,
    'ref'
  >;

/** The root component for the XY chart. */
export function SVGXYChart<
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  AlternateDependentScaleConfig extends ScaleConfig<AxisScaleOutput>
>(props: SVGXYChartProps<IndependentScaleConfig, DependentScaleConfig, AlternateDependentScaleConfig>) {
  const {
    width,
    height,
    parentSizeDebounceMs = defaultParentSizeDebounceMs,
    hideTooltipDebounceMs = defaultHideTooltipDebounceMs,
    persistentTooltipBehaviour,
    ...restProps
  } = props;

  if (isNil(width) || isNil(height)) {
    // If hardcoded dimensions are not available then wrap the chart in ParentSize.
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
    <TooltipProvider
      hideTooltipDebounceMs={hideTooltipDebounceMs}
      persistentTooltipBehaviour={persistentTooltipBehaviour ?? false}
    >
      <EventEmitterProvider>
        <InnerChart {...restProps} width={width} height={height} />
      </EventEmitterProvider>
    </TooltipProvider>
  );
}

function InnerChart<
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput>,
  AlternateDependentScaleConfig extends ScaleConfig<AxisScaleOutput>
>({
  width = 0,
  height = 0,
  independentScale: independentScaleConfig,
  dependentScale: dependentScaleConfig,
  alternateDependentScale: alternateDependentScaleConfig,
  independentRangePadding = zeroRangePadding,
  dependentRangePadding = zeroRangePadding,
  margin: userMargin,
  horizontal = false,
  animate = true,
  animateSVG = true,
  springConfig = defaultSpringConfig,
  renderingOffset = 0,
  captureEvents = true,
  theme = defaultTheme,
  children,
  outerMargin = zeroMargin,
  ...svgProps
}: SVGXYChartProps<IndependentScaleConfig, DependentScaleConfig, AlternateDependentScaleConfig>) {
  // Gather all the series data from the chart's child components:
  const { dataEntries, groupScale } = getDataEntriesFromChildren(children);

  // Create the scales, each with a composite domain derived from all the series data.
  const independentDomainValues = dataEntries
    .map((dataEntry) => dataEntry.getDomainValuesForIndependentScale())
    .reduce((acc, val) => acc.concat(val), []);
  const independentScale = createScaleFromScaleConfig(independentDomainValues, independentScaleConfig);

  const dependentDomainValues = dataEntries
    .map((dataEntry) => dataEntry.getDomainValuesForDependentScale())
    .reduce((acc, val) => acc.concat(val), []);
  const dependentScale = createScaleFromScaleConfig(dependentDomainValues, dependentScaleConfig);

  const alternateDependentDomainValues = dataEntries
    .map((dataEntry) => dataEntry.getDomainValuesForAlternateDependentScale())
    .reduce((acc, val) => acc.concat(val), []);
  const alternateDependentScale = createScaleFromScaleConfig(
    alternateDependentDomainValues,
    alternateDependentScaleConfig
  );

  // Create a fallback color scale for coloring each series:
  const colorScale = createScale({
    type: 'ordinal',
    domain: dataEntries.map((entry) => entry.dataKey),
    range: theme.colors as string[]
  });

  // Returns event handlers to be applied to the <rect> that is for capturing events.
  // Each handler just emits the event.
  const eventEmitters = useEventEmitters({ source: xyChartEventSource });

  let dataContextValue: IXYChartContext | null = null;
  const hasValidContent = !isNil(independentScale) && !isNil(dependentScale) && width > 0 && height > 0;

  if (hasValidContent) {
    const resolvedOuterMargin: Margin =
      typeof outerMargin === 'number'
        ? { left: outerMargin, right: outerMargin, top: outerMargin, bottom: outerMargin }
        : outerMargin;
    const resolvedIndependentRangePadding = resolveRangePadding(independentRangePadding);
    const resolvedDependentRangePadding = resolveRangePadding(dependentRangePadding);

    // Use the given margin object or calculate it automatically:
    const resolvedMargin =
      userMargin ??
      calculateAutoMarginFromChildren({
        children,
        horizontal,
        independentScale,
        dependentScale,
        alternateDependentScale,
        independentRangePadding: resolvedIndependentRangePadding,
        dependentRangePadding: resolvedDependentRangePadding,
        theme
      });

    const margin = addMargins([resolvedMargin, resolvedOuterMargin]);

    const chartDimensions = new ChartDimensions({
      width,
      height,
      horizontal,
      margin, // The margin includes the outerMargin.
      outerMargin: resolvedOuterMargin,
      independentRangePadding: resolvedIndependentRangePadding,
      dependentRangePadding: resolvedDependentRangePadding
    });

    // Calculate the range for each scale:
    const independentRange = getIndependentRange(chartDimensions.chartAreaIncludingRangePadding, horizontal);
    const dependentRange = getDependentRange(chartDimensions.chartAreaIncludingRangePadding, horizontal);

    // Update the scales with the calculated ranges:
    independentScale.range(independentRange);
    dependentScale.range(dependentRange);
    alternateDependentScale && alternateDependentScale.range(dependentRange);
    groupScale && groupScale.range([0, getScaleBandwidth(independentScale)]);

    dataContextValue = {
      scales: new ScaleSet({
        independentScale,
        dependentScale,
        alternateDependentScale,
        groupScale,
        colorScale
      }),
      chartDimensions,
      dataEntryStore: new DataEntryStore(dataEntries),
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
    update: { opacity: 1 }, // Appears to be required.
    leave: { opacity: 0 },
    config: springConfig,
    key: Boolean(dataContextValue),
    immediate: !(animate && animateSVG)
  });

  return (
    <>
      {transitions(({ opacity }, context) =>
        context ? (
          <animated.svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            style={{ ...theme?.svg?.style, ...style, opacity }}
            className={`${className} ${theme?.svg?.className ?? ''}`}
            {...restSvgProps}
          >
            <XYChartContext.Provider value={context}>{children}</XYChartContext.Provider>
            {captureEvents && (
              <rect
                x={context.chartDimensions.chartAreaExcludingRangePadding.x}
                y={context.chartDimensions.chartAreaExcludingRangePadding.y}
                width={context.chartDimensions.chartAreaExcludingRangePadding.width}
                height={context.chartDimensions.chartAreaExcludingRangePadding.height}
                fill="transparent"
                role="presentation"
                aria-hidden
                {...eventEmitters}
                onClick={(event) => {
                  // Prevent the tooltip closing immediately when shown because of a touch.
                  event.stopPropagation();
                }}
              />
            )}
          </animated.svg>
        ) : null
      )}
    </>
  );
}
