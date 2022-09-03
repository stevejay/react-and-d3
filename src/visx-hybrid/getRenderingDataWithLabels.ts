import { isNil } from './isNil';
import type { AxisScale, IDataEntry, ScaleInput } from './types';

export interface RenderingDatumWithLabel<RenderingDatum extends object> {
  datum: RenderingDatum;
  label: string;
}

export function getRenderingDataWithLabels<Datum extends object, RenderingDatum extends object>(
  dataEntry: IDataEntry<Datum, RenderingDatum>,
  hideZero: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (value: ScaleInput<AxisScale>) => string
): RenderingDatumWithLabel<RenderingDatum>[] {
  const data = dataEntry.getRenderingData().filter((datum) => dataEntry.isRenderingDatumDefined(datum));
  return data.reduce((acc, datum) => {
    const value = dataEntry.dependentAccessor(dataEntry.getOriginalDatumFromRenderingDatum(datum));
    const isHidden = value === 0 && hideZero;
    // if (!isHidden) {
    //   acc.push({ datum, label: isNil(value) ? '' : formatter?.(value) ?? '' });
    // }

    acc.push({ datum, label: isHidden ? '' : isNil(value) ? '' : formatter?.(value) ?? '' });

    return acc;
  }, [] as RenderingDatumWithLabel<RenderingDatum>[]);
}
