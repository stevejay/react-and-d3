import { useMemo, useState } from 'react';
import { AxisScale } from '@visx/axis';

import { DataRegistry } from './DataRegistry';
import { DataContextType } from './types';

/** Hook that returns an API equivalent to DataRegistry but which updates as needed for use as a hook. */
export function useDataRegistry<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
  OriginalDatum extends object
>(): DataContextType<XScale, YScale, Datum, OriginalDatum>['dataRegistry'] {
  const [, forceUpdate] = useState({});
  const privateRegistry = useMemo(() => new DataRegistry<XScale, YScale, Datum, OriginalDatum>(), []);

  return useMemo(
    () => ({
      registerData: (
        ...params: Parameters<
          DataContextType<XScale, YScale, Datum, OriginalDatum>['dataRegistry']['registerData']
        >
      ) => {
        privateRegistry.registerData(...params);
        forceUpdate({});
      },
      unregisterData: (
        ...params: Parameters<
          DataContextType<XScale, YScale, Datum, OriginalDatum>['dataRegistry']['unregisterData']
        >
      ) => {
        privateRegistry.unregisterData(...params);
        forceUpdate({});
      },
      entries: () => privateRegistry.entries(),
      get: (key: string) => privateRegistry.get(key),
      keys: () => privateRegistry.keys()
    }),
    [privateRegistry]
  );
}
