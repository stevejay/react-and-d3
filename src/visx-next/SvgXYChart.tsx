import { ReactNode, SVGProps, useContext, useEffect } from 'react';
import { SpringConfig } from 'react-spring';
import { AxisScaleOutput } from '@visx/axis';
import { isNil } from 'lodash-es';

import { DataContext } from './DataContext';
import { DataContextProvider, DataContextProviderProps } from './DataContextProvider';
import { ParentSize } from './ParentSize';
import { ScaleConfig } from './scale';
import { Margin } from './types';

// TODO what about predetermined domain ranges?

const defaultMargin = { top: 50, right: 50, bottom: 50, left: 50 };

export type SvgXYChartProps<
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  YScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object
> = {
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
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>;

export function SvgXYChart<
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
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
    ...svgProps
  } = props;

  const { setDimensions } = useContext(DataContext);

  useEffect(() => {
    if (setDimensions && width && width > 0 && height && height > 0) {
      setDimensions({ width, height, margin });
    }
  }, [setDimensions, width, height, margin]);

  // if Context or dimensions are not available, wrap self in the needed providers
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

  if (isNil(width) || isNil(height)) {
    return (
      <ParentSize>
        {(dimensions) => (
          <SvgXYChart {...props} width={width ?? dimensions.width} height={height ?? dimensions.height} />
        )}
      </ParentSize>
    );
  }

  return width && width > 0 && height && height > 0 ? (
    <svg xmlns="http://www.w3.org/2000/svg" {...svgProps} width={width} height={height}>
      {children}
      {/* <rect
        x={margin.left}
        y={margin.top}
        width={width - margin.left - margin.right}
        height={height - margin.top - margin.bottom}
        fill="transparent"
        {...eventEmitters}
      /> */}
    </svg>
  ) : null;
}
