import { ReactNode, useMemo } from 'react';
import { SpringConfig } from 'react-spring';
import { AxisScaleOutput } from '@visx/axis';
import { ScaleConfig, ScaleConfigToD3Scale, scaleOrdinal } from '@visx/scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { defaultSpringConfig } from './constants';
import { DataContext } from './DataContext';
import { useDataRegistry } from './useDataRegistry';
import { Dimensions, useDimensions } from './useDimensions';
import { useScales } from './useScales';

/** Props that can be passed to initialize/update the provider config. */
export interface DataContextProviderProps<
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  YScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>
> {
  /** Optionally define the initial dimensions. */
  initialDimensions?: Partial<Dimensions>;
  /** x-scale configuration whose shape depends on scale type. */
  xScale: XScaleConfig;
  /** y-scale configuration whose shape depends on scale type. */
  yScale: YScaleConfig;
  /** Optionally define the series' colors. Must a stable array. */
  seriesColors?: readonly string[];
  /** Determines whether Series will be plotted horizontally (e.g., horizontal bars). */
  horizontal?: boolean;
  /**  A react-spring configuration object. */
  springConfig?: SpringConfig;
  xRangePadding?: number;
  yRangePadding?: number;
  /* Any React children. */
  children: ReactNode;
}

export function DataContextProvider<
  XScaleConfig extends ScaleConfig<AxisScaleOutput>,
  YScaleConfig extends ScaleConfig<AxisScaleOutput>,
  Datum extends object,
  OriginalDatum extends object
>({
  initialDimensions,
  xScale: xScaleConfig,
  yScale: yScaleConfig,
  children,
  horizontal,
  springConfig = defaultSpringConfig,
  xRangePadding = 0,
  yRangePadding = 0,
  seriesColors = schemeCategory10
}: DataContextProviderProps<XScaleConfig, YScaleConfig>) {
  const [{ width, height, margin }, setDimensions] = useDimensions(initialDimensions);
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  type XScale = ScaleConfigToD3Scale<XScaleConfig, AxisScaleOutput, any, any>;
  type YScale = ScaleConfigToD3Scale<YScaleConfig, AxisScaleOutput, any, any>;

  const dataRegistry = useDataRegistry<XScale, YScale, Datum, OriginalDatum>();

  const { xScale, yScale }: { xScale?: XScale; yScale?: YScale } = useScales({
    dataRegistry,
    xScaleConfig,
    yScaleConfig,
    xRange: [margin.left + xRangePadding, Math.max(0, width - margin.right - xRangePadding)],
    yRange: [Math.max(0, height - margin.bottom - yRangePadding), margin.top + yRangePadding]
  });

  const registryKeys = dataRegistry.keys();

  // Create a color scale that provides a fallback color for each series.
  const colorScale = useMemo(
    () =>
      scaleOrdinal({
        domain: registryKeys,
        range: seriesColors as string[]
      }),
    [registryKeys, seriesColors]
  );

  const value = useMemo(
    () => ({
      dataRegistry,
      registerData: dataRegistry.registerData,
      unregisterData: dataRegistry.unregisterData,
      xScale,
      yScale,
      colorScale,
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      setDimensions,
      horizontal,
      springConfig,
      xRangePadding,
      yRangePadding
    }),
    [
      dataRegistry,
      xScale,
      yScale,
      colorScale,
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      setDimensions,
      horizontal,
      springConfig,
      xRangePadding,
      yRangePadding
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
