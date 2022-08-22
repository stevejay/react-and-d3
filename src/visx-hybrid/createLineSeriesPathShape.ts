import { CurveFactory, CurveFactoryLineOnly, line as d3Line } from 'd3-shape';

import { setNumberOrNumberAccessor } from './setNumberOrNumberAccessor';
import type { IDataEntry, IScaleSet } from './types';

export function createLineSeriesPathShape<Datum extends object>({
  scales,
  dataEntry,
  horizontal,
  curve
}: {
  scales: IScaleSet;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataEntry: IDataEntry<Datum, any>;
  horizontal: boolean;
  curve: CurveFactory | CurveFactoryLineOnly;
  renderingOffset: number;
}): string {
  const independentCenterAccessor = dataEntry.getIndependentAccessor(scales, 'center');
  const dependent1Accessor = dataEntry.getDependentAccessor(scales);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definedAccessor = (datum: any) => dataEntry.isRenderingDatumDefined(datum);

  const line = d3Line<Datum>();
  line.defined(definedAccessor);
  line.curve(curve);
  setNumberOrNumberAccessor(line.x, horizontal ? dependent1Accessor : independentCenterAccessor);
  setNumberOrNumberAccessor(line.y, horizontal ? independentCenterAccessor : dependent1Accessor);
  return line(dataEntry.getRenderingData()) ?? '';
}
