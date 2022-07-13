import { ComponentType, useContext, useEffect } from 'react';
import { AxisScale } from '@visx/axis';

import { DataContext } from './DataContext';
import { DataContextType, SeriesProps } from './types';

export type WithRegisteredDataProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = Pick<DataContextType<XScale, YScale, Datum, Datum>, 'xScale' | 'yScale'>;

/**
 * An HOC that handles registering the Series's data and renders the
 * `BaseSeriesComponent`
 * - only if x and y scales are available in context, and
 * - overrides `props.data/xAccessor/yAccessor` with the values from context.
 * This is useful for avoiding nasty syntax with undefined scales when using
 * hooks, and ensures that data + scales are always matched in the case of
 * prop changes, etc.
 */
export function withRegisteredData<
  BaseComponentProps extends SeriesProps<XScale, YScale, Datum>,
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
>(BaseSeriesComponent: ComponentType<BaseComponentProps>) {
  function WrappedComponent<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>(
    // WrappedComponent props include SeriesProps with appropriate generics
    // and any props in BaseComponentProps that are not in WithRegisteredDataProps
    props: SeriesProps<XScale, YScale, Datum> &
      Omit<
        BaseComponentProps,
        keyof SeriesProps<XScale, YScale, Datum> | keyof WithRegisteredDataProps<XScale, YScale, Datum>
      >
  ) {
    const { dataKey, data, keyAccessor, xAccessor, yAccessor, colorAccessor } = props;
    const { xScale, yScale, dataRegistry, springConfig } = useContext(
      DataContext
    ) as unknown as DataContextType<XScale, YScale, Datum, Datum>;

    useEffect(() => {
      if (dataRegistry) {
        dataRegistry.registerData({ key: dataKey, data, keyAccessor, xAccessor, yAccessor, colorAccessor });
        return () => dataRegistry.unregisterData(dataKey);
      }
    }, [dataRegistry, dataKey, data, keyAccessor, xAccessor, yAccessor, colorAccessor]);

    const registryEntry = dataRegistry?.get(dataKey);

    // If scales or data are not available in context, render nothing...
    if (!xScale || !yScale || !registryEntry) {
      return null;
    }

    const BaseComponent = BaseSeriesComponent as unknown as ComponentType<
      SeriesProps<XScale, YScale, Datum> & WithRegisteredDataProps<XScale, YScale, Datum>
    >;

    // ... otherwise pass props + over-write data/accessors:
    return (
      <BaseComponent
        {...props}
        xScale={xScale}
        yScale={yScale}
        data={registryEntry.data}
        keyAccessor={registryEntry.keyAccessor}
        xAccessor={registryEntry.xAccessor}
        yAccessor={registryEntry.yAccessor}
        colorAccessor={registryEntry.colorAccessor}
        springConfig={springConfig}
      />
    );
  }

  return WrappedComponent;
}
