import { area as d3Area, CurveFactory } from 'd3-shape';

// import { getScaleBaseline } from './getScaleBaseline';
// import { getScaledValueFactory } from './getScaledFactoryValue';
// import { isValidNumber } from './isValidNumber';
import { setNumberOrNumberAccessor } from './setNumberOrNumberAccessor';
import type { AxisScale, IDataEntry, ScaleInput, ScaleSet } from './types';

export function createAreaSeriesPathShape<Datum extends object>(params: {
  scales: ScaleSet;
  dataEntry: IDataEntry<Datum, Datum>;
  horizontal: boolean;
  curve: CurveFactory;
  renderingOffset: number;
  dependent0Accessor?: (datum: Datum) => ScaleInput<AxisScale>;
}): string {
  const { dataEntry, curve, horizontal } = params;
  const accessors = dataEntry.getAreaAccessors(params);

  // const getScaledIndependent = getScaledValueFactory(scales.independent, dataEntry.independentAccessor);
  // const getScaledDependent = getScaledValueFactory(scales.dependent, dataEntry.dependentAccessor);
  // const getScaledDependent0 = dependent0Accessor
  //   ? getScaledValueFactory(scales.dependent, dependent0Accessor)
  //   : getScaleBaseline(scales.dependent);
  // const isDefined = (datum: Datum) =>
  //   isValidNumber(scales.independent(dataEntry.independentAccessor(datum))) &&
  //   isValidNumber(scales.dependent(dataEntry.dependentAccessor(datum)));
  const area = d3Area<Datum>();
  area.defined(accessors.defined);
  area.curve(curve);
  setNumberOrNumberAccessor(horizontal ? area.y : area.x, accessors.independent);
  setNumberOrNumberAccessor(horizontal ? area.x0 : area.y0, accessors.dependent0);
  setNumberOrNumberAccessor(horizontal ? area.x1 : area.y1, accessors.dependent);
  return dataEntry.createShape(area) ?? '';
}
