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
  dataEntry: IDataEntry<Datum, Datum>;
  horizontal: boolean;
  curve: CurveFactory;
  renderingOffset: number;
  dependent0Accessor?: (datum: Datum) => ScaleInput<AxisScale>;
}): string {
  const accessors = dataEntry.getAreaAccessorsForRenderingData(scales, dependent0Accessor);
  const area = d3Area<Datum>();
  area.defined(accessors.defined);
  area.curve(curve);
  setNumberOrNumberAccessor(horizontal ? area.y : area.x, accessors.independent);
  setNumberOrNumberAccessor(horizontal ? area.x0 : area.y0, accessors.dependent0);
  setNumberOrNumberAccessor(horizontal ? area.x1 : area.y1, accessors.dependent);
  return area(dataEntry.getRenderingData()) ?? '';
}
