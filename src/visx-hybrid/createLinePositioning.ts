import { CurveFactory, CurveFactoryLineOnly, line as d3Line } from 'd3-shape';

import { getScaledValueFactory } from './getScaledFactoryValue';
import { isValidNumber } from './isValidNumber';
import { setNumberOrNumberAccessor } from './setNumberOrNumberAccessor';
import type { IDataEntry, LinePathConfig, ScaleSet } from './types';

// Approach for interpolating the line is from
// https://codesandbox.io/s/react-spring-d3-interpolate-path-nz85r?file=/src/App.js

function line<Datum>({ x, y, defined, curve }: LinePathConfig<Datum> = {}) {
  const path = d3Line<Datum>();
  if (x) {
    setNumberOrNumberAccessor(path.x, x);
  }
  if (y) {
    setNumberOrNumberAccessor(path.y, y);
  }
  if (defined) {
    path.defined(defined);
  }
  if (curve) {
    path.curve(curve);
  }
  return path;
}

export function createLinePositioning<Datum extends object, RenderingDatum extends object>({
  scales,
  dataEntry,
  horizontal,
  curve
}: {
  scales: ScaleSet;
  dataEntry: IDataEntry<Datum, RenderingDatum>;
  horizontal: boolean;
  curve: CurveFactory | CurveFactoryLineOnly;
  renderingOffset: number;
}) {
  const getScaledIndependent = getScaledValueFactory(scales.independent, dataEntry.independentAccessor);
  const getScaledDependent = getScaledValueFactory(scales.dependent, dataEntry.dependentAccessor);
  const isDefined = (datum: Datum) => {
    // console.log(
    //   'isDefined',
    //   datum,
    //   isValidNumber(scales.independent(dataEntry.independentAccessor(datum))) &&
    //     isValidNumber(scales.dependent(dataEntry.dependentAccessor(datum)))
    // );
    return (
      isValidNumber(scales.independent(dataEntry.independentAccessor(datum))) &&
      isValidNumber(scales.dependent(dataEntry.dependentAccessor(datum)))
    );
  };
  // const color = scales.color?.(dataKey) ?? theme?.colors?.[0] ?? '#222';

  return line<Datum>(
    horizontal
      ? { x: getScaledDependent, y: getScaledIndependent, defined: isDefined, curve }
      : { x: getScaledIndependent, y: getScaledDependent, defined: isDefined, curve }
  );

  //   const xScaleCopy = xScale.copy();
  //   const yScaleCopy = yScale.copy();

  //   const getScaledX = createScaledValueAccessor(xScaleCopy, xAccessor);
  //   const getScaledY = createScaledValueAccessor(yScaleCopy, yAccessor);

  //   const isDefined = (datum: Datum) =>
  //     isValidNumber(xScale(xAccessor(datum))) && isValidNumber(yScale(yAccessor(datum)));

  //   return line<Datum>({ x: getScaledX, y: getScaledY, defined: isDefined, curve });
}
