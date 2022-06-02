import { ReactNode, SVGProps, useContext, useEffect } from 'react';
import { AxisScaleOutput } from '@visx/axis';
import { ParentSizeModern } from '@visx/responsive';

import { DataContext } from './DataContext';
import { DataContextProvider, DataContextProviderProps } from './DataContextProvider';
import { ScaleConfig } from './scale';
import { Margin } from './types';

// TODO what about predetermined domain ranges?

export interface XyChartProps<
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  YScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object
> {
  svgProps?: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>;
  /** Total width of the desired chart svg, including margin. */
  width?: number;
  /** Total height of the desired chart svg, including margin. */
  height?: number;
  /** Margin to apply around the outside. */
  margin?: Margin;
  /** If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as the xScale config. */
  xScale?: DataContextProviderProps<XScaleConfig, YScaleConfig>['xScale'];
  /** If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as the yScale config. */
  yScale?: DataContextProviderProps<XScaleConfig, YScaleConfig>['yScale'];
  /* If DataContext is not available, XYChart will wrap itself in a DataContextProvider and set this as horizontal. */
  horizontal?: boolean;
  /** XYChart children. */
  children: ReactNode;
}

const DEFAULT_MARGIN = { top: 50, right: 50, bottom: 50, left: 50 };

export function XyChart<
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  YScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object
>(props: XyChartProps<XScaleConfig, YScaleConfig, Datum>) {
  //   return <ParentSize>{children}</ParentSize>;
  const { width, height, margin = DEFAULT_MARGIN, svgProps, xScale, yScale, horizontal, children } = props;

  const { setDimensions } = useContext(DataContext); // TODO

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
      >
        <XyChart {...props} />
      </DataContextProvider>
    );
  }

  if (width == null || height == null) {
    return (
      <ParentSizeModern>
        {(dims) => (
          <XyChart
            {...props}
            width={props.width == null ? dims.width : props.width}
            height={props.height == null ? dims.height : props.height}
          />
        )}
      </ParentSizeModern>
    );
  }

  return width && width > 0 && height && height > 0 ? (
    <svg width={width} height={height} {...svgProps}>
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
