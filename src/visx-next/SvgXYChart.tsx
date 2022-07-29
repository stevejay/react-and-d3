import { PointerEvent, ReactNode, SVGProps, useContext } from 'react';
import { SpringConfig } from 'react-spring';
import { AxisScaleOutput } from '@visx/axis';
import { isNil } from 'lodash-es';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import { ParentSize } from '../visx-hybrid/ParentSize';

import { DataContext } from './DataContext';
import { DataContextProvider, DataContextProviderProps } from './DataContextProvider';
import { EventEmitterContext, EventEmitterProvider } from './EventEmitterProvider';
import { XYCHART_EVENT_SOURCE } from './eventSources';
import { ScaleConfig } from './scale';
import { TooltipContext } from './TooltipContext';
import { TooltipProvider } from './TooltipProvider';
import { EventHandlerParams, Margin } from './types';
import { useEventEmitters } from './useEventEmitters';
import { POINTER_EVENTS_ALL, POINTER_EVENTS_NEAREST, useEventHandlers } from './useEventHandlers';

// TODO what about predetermined domain ranges?

const defaultMargin = { top: 50, right: 50, bottom: 50, left: 50 };

export type SvgXYChartProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  YScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object
> = {
  /** Whether to capture and dispatch pointer events to EventEmitter context (which e.g., Series subscribe to). */
  captureEvents?: boolean;

  hideTooltipDebounceMs?: number;
  /**
   * Total width of the desired chart svg, including margin.
   * If `width`` is nil then XYChart will wrap itself in a ParentSizeModern and use it
   * to set the chart width.
   */
  width?: number;
  /**
   * Total height of the desired chart svg, including margin.
   * If `height`` is nil then XYChart will wrap itself in a ParentSizeModern and use it
   * to set the chart height.
   */
  height?: number;
  /** Margin to apply around the chart. */
  margin?: Margin;
  /** If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as the xScale config. */
  xScale?: DataContextProviderProps<XScaleConfig, YScaleConfig>['xScale'];
  /** If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as the yScale config. */
  yScale?: DataContextProviderProps<XScaleConfig, YScaleConfig>['yScale'];
  /** If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as horizontal. */
  horizontal?: boolean;
  /**
   * A react-spring configuration object.
   * If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as springConfig.
   * If provided, must be a stable object.
   */
  springConfig?: SpringConfig;
  xRangePadding?: number;
  yRangePadding?: number;
  seriesColors?: string[];
  /** XYChart children. */
  children: ReactNode;
  onPointerMove?: (params: EventHandlerParams<Datum>) => void;
  /** Callback invoked for onPointerOut events for the nearest Datum to the PointerEvent _for each Series with pointerEvents={true}_. */
  onPointerOut?: (
    /** The PointerEvent. */
    event: PointerEvent
  ) => void;
  /** Callback invoked for onPointerUp events for the nearest Datum to the PointerEvent _for each Series with pointerEvents={true}_. */
  onPointerUp?: (params: EventHandlerParams<Datum>) => void;
  /** Whether to invoke PointerEvent handlers for all dataKeys, or the nearest dataKey. */
  pointerEventsDataKey?: 'all' | 'nearest';
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'onPointerMove' | 'onPointerOut' | 'onPointerUp'>;

const allowedEventSources = [XYCHART_EVENT_SOURCE];

export function SvgXYChart<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  YScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object
>(props: SvgXYChartProps<XScaleConfig, YScaleConfig, Datum>) {
  const {
    width,
    height,
    margin = defaultMargin,
    xScale,
    yScale,
    horizontal,
    springConfig,
    xRangePadding,
    yRangePadding,
    seriesColors,
    children,
    onPointerMove,
    onPointerOut,
    onPointerUp,
    pointerEventsDataKey = 'nearest',
    captureEvents = true,
    hideTooltipDebounceMs = 400,
    ...svgProps
  } = props;

  const tooltipContext = useContext(TooltipContext);
  const { setDimensions } = useContext(DataContext);
  const emitter = useContext(EventEmitterContext);

  useIsomorphicLayoutEffect(() => {
    if (setDimensions && width && width > 0 && height && height > 0) {
      setDimensions({ width, height, margin });
    }
  }, [setDimensions, width, height, margin]);

  // Returns event handlers to be applied to the <rect> that is for capturing events.
  // Each handler just emits the event.
  const eventEmitters = useEventEmitters({ source: XYCHART_EVENT_SOURCE });

  // Adds event handlers for the pointer events that have handlers in the chart props.
  // Only events from the <rect> that is for capturing events are listened for.
  useEventHandlers({
    dataKey: pointerEventsDataKey === 'nearest' ? POINTER_EVENTS_NEAREST : POINTER_EVENTS_ALL,
    onPointerMove,
    onPointerOut,
    onPointerUp,
    allowedSources: allowedEventSources
  });

  // if DataContext is not available, wrap self in that provider.
  if (!setDimensions) {
    if (!xScale || !yScale) {
      console.warn(
        'XyChart: When no DataContextProvider is available in context, you must pass xScale & yScale config to XyChart.'
      );
      return null;
    }
    return (
      <DataContextProvider
        xScale={xScale}
        yScale={yScale}
        initialDimensions={{ width, height, margin }}
        horizontal={horizontal}
        springConfig={springConfig}
        xRangePadding={xRangePadding}
        yRangePadding={yRangePadding}
        seriesColors={seriesColors}
      >
        <SvgXYChart {...props} />
      </DataContextProvider>
    );
  }

  // If hardcoded dimensions are not available, wrap self in ParentSize.
  if (isNil(width) || isNil(height)) {
    return (
      <ParentSize>
        {(dimensions) => (
          <SvgXYChart {...props} width={width ?? dimensions.width} height={height ?? dimensions.height} />
        )}
      </ParentSize>
    );
  }

  if (isNil(tooltipContext)) {
    return (
      <TooltipProvider hideTooltipDebounceMs={hideTooltipDebounceMs}>
        <SvgXYChart {...props} />
      </TooltipProvider>
    );
  }

  // EventEmitterProvider should be the last wrapper so we do not duplicate handlers
  if (isNil(emitter)) {
    return (
      <EventEmitterProvider>
        <SvgXYChart {...props} />
      </EventEmitterProvider>
    );
  }

  return width && width > 0 && height && height > 0 ? (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} {...svgProps}>
      {children}
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
}
