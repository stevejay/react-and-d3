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
  dataEntry: IDataEntry<Datum, Datum>;
  horizontal: boolean;
  curve: CurveFactory | CurveFactoryLineOnly;
  renderingOffset: number;
}): string {
  const accessors = dataEntry.getAreaAccessorsForRenderingData(scales);
  const line = d3Line<Datum>();
  line.defined(accessors.defined);
  line.curve(curve);
  setNumberOrNumberAccessor(line.x, horizontal ? accessors.dependent : accessors.independent);
  setNumberOrNumberAccessor(line.y, horizontal ? accessors.independent : accessors.dependent);
  return line(dataEntry.getRenderingData()) ?? '';
}
