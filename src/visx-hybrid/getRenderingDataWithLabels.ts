import { isNil } from './isNil';
import type { AxisScale, IDataEntry, ScaleInput } from './types';

export function getRenderingDataWithLabels<Datum extends object, RenderingDatum extends object>(
  dataEntry: IDataEntry<Datum, RenderingDatum>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (value: ScaleInput<AxisScale>) => string
): {
  datum: RenderingDatum;
  label: string;
}[] {
  return dataEntry
    .getRenderingData()
    .filter((datum) => dataEntry.renderingDatumIsDefined(datum))
    .map((datum) => {
      const value = dataEntry.dependentAccessor(dataEntry.getOriginalDatumFromRenderingDatum(datum));
      return { datum, label: isNil(value) ? '' : formatter?.(value) ?? '' };
    });
}
