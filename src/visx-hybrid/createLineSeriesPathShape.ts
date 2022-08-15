import { CurveFactory, CurveFactoryLineOnly, line as d3Line } from 'd3-shape';

import { getScaledValueFactory } from './getScaledFactoryValue';
import { isValidNumber } from './isValidNumber';
import { setNumberOrNumberAccessor } from './setNumberOrNumberAccessor';
import type { IDataEntry, ScaleSet } from './types';

export function createLineSeriesPathShape<Datum extends object>({
  scales,
  dataEntry,
  horizontal,
  curve
}: {
  scales: ScaleSet;
  dataEntry: IDataEntry<Datum, Datum>;
  horizontal: boolean;
  curve: CurveFactory | CurveFactoryLineOnly;
  renderingOffset: number;
}): string {
  const getScaledIndependent = getScaledValueFactory(scales.independent, dataEntry.independentAccessor);
  const getScaledDependent = getScaledValueFactory(scales.dependent, dataEntry.dependentAccessor);
  const isDefined = (datum: Datum) =>
    isValidNumber(scales.independent(dataEntry.independentAccessor(datum))) &&
    isValidNumber(scales.dependent(dataEntry.dependentAccessor(datum)));
  const line = d3Line<Datum>();
  line.defined(isDefined);
  line.curve(curve);
  setNumberOrNumberAccessor(line.x, horizontal ? getScaledDependent : getScaledIndependent);
  setNumberOrNumberAccessor(line.y, horizontal ? getScaledIndependent : getScaledDependent);
  return dataEntry.createShape(line) || '';
}
