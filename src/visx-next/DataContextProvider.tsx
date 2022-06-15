import { ReactNode, useMemo } from 'react';
import { SpringConfig } from 'react-spring';
// import createOrdinalScale from '@visx/scale/lib/scales/ordinal';
import { AxisScaleOutput } from '@visx/axis';
import { ScaleConfig, ScaleConfigToD3Scale } from '@visx/scale';

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
  /* Optionally define the initial dimensions. */
  initialDimensions?: Partial<Dimensions>;
  /* x-scale configuration whose shape depends on scale type. */
  xScale: XScaleConfig;
  /* y-scale configuration whose shape depends on scale type. */
  yScale: YScaleConfig;
  /* Determines whether Series will be plotted horizontally (e.g., horizontal bars). */
  horizontal?: boolean;
  /* 
  A react-spring configuration object
  */
  springConfig?: SpringConfig;
  /* Any React children. */
  children: ReactNode;
}

export function DataContextProvider<
  XScaleConfig extends ScaleConfig<AxisScaleOutput>,
  YScaleConfig extends ScaleConfig<AxisScaleOutput>,
  Datum extends object
>({
  initialDimensions,
  xScale: xScaleConfig,
  yScale: yScaleConfig,
  children,
  horizontal,
  springConfig = defaultSpringConfig
}: DataContextProviderProps<XScaleConfig, YScaleConfig>) {
  const [{ width, height, margin }, setDimensions] = useDimensions(initialDimensions);
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  type XScale = ScaleConfigToD3Scale<XScaleConfig, AxisScaleOutput, any, any>;
  type YScale = ScaleConfigToD3Scale<YScaleConfig, AxisScaleOutput, any, any>;

  const dataRegistry = useDataRegistry<XScale, YScale, Datum>();

  const { xScale, yScale }: { xScale?: XScale; yScale?: YScale } = useScales({
    dataRegistry,
    xScaleConfig,
    yScaleConfig,
    xRange: [margin.left, Math.max(0, width - margin.right)],
    yRange: [Math.max(0, height - margin.bottom), margin.top]
  });

  //   const registryKeys = dataRegistry.keys();

  // This is to have a color per series:
  //
  //   const colorScale = useMemo(
  //     () =>
  //       createOrdinalScale({
  //         domain: registryKeys,
  //         range: theme.colors
  //       }),
  //     [registryKeys, theme.colors]
  //   );

  const value = useMemo(
    () => ({
      dataRegistry,
      registerData: dataRegistry.registerData,
      unregisterData: dataRegistry.unregisterData,
      xScale,
      yScale,
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      setDimensions,
      horizontal,
      springConfig
    }),
    [
      dataRegistry,
      xScale,
      yScale,
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      setDimensions,
      horizontal,
      springConfig
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
