import { area as d3Area, CurveFactory } from 'd3-shape';

import { setNumberOrNumberAccessor } from './setNumberOrNumberAccessor';
import type { AxisScale, IDataEntry, IScaleSet, ScaleInput } from './types';

/**
 * Uses the d3 area function to create a `d` string for an SVG <path> element.
 */
export function createAreaSeriesPathShape<Datum extends object>({
  scales,
  dataEntry,
  curve,
  horizontal,
  dependent0Accessor
}: {
  scales: IScaleSet;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataEntry: IDataEntry<Datum, any>;
  horizontal: boolean;
  curve: CurveFactory;
  renderingOffset: number;
  dependent0Accessor?: (datum: Datum) => ScaleInput<AxisScale>;
}): string {
  const independentCenterAccessor = dataEntry.getIndependentCenterAccessor(scales);
  const resolvedDependent0Accessor = dataEntry.getDependent0Accessor(scales, dependent0Accessor);
  const dependent1Accessor = dataEntry.getDependent1Accessor(scales);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definedAccessor = (datum: any) => dataEntry.renderingDatumIsDefined(datum);

  // dataEntry.getDefinedAccessor(scales);

  const area = d3Area<Datum>();
  area.defined(definedAccessor);
  area.curve(curve);
  setNumberOrNumberAccessor(horizontal ? area.y : area.x, independentCenterAccessor);
  setNumberOrNumberAccessor(horizontal ? area.x0 : area.y0, resolvedDependent0Accessor);
  setNumberOrNumberAccessor(horizontal ? area.x1 : area.y1, dependent1Accessor);
  return area(dataEntry.getRenderingData()) ?? '';
}
