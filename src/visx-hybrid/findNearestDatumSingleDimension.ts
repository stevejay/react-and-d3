import { bisectLeft, bisector, range as d3Range } from 'd3-array';
import { isNil } from 'lodash-es';

import type { AxisScale, ScaleInput } from './types';

// @TODO make more robust to null/undefined scaled values
/** Finds the nearest datum in a single direction (x or y) closest to the specified `scaledValue`. */
export function findNearestDatumSingleDimension<Scale extends AxisScale, Datum extends object>({
  scale,
  accessor,
  scaledValue,
  data
}: {
  scale: Scale;
  accessor: (datum: Datum) => ScaleInput<Scale>;
  scaledValue: number;
  data: readonly Datum[];
}) {
  let nearestDatum: Datum;
  let nearestDatumIndex: number;
  // if scale has .invert(), convert svg coord to nearest data value
  if ('invert' in scale && typeof scale.invert === 'function') {
    const bisect = bisector(accessor).left;
    // find closest data value, then map that to closest datum
    const dataValue = Number(scale.invert(scaledValue));
    const index = bisect(data, dataValue);
    // take the two datum nearest this index, and compute which is closer
    const nearestDatum0 = data[index - 1];
    const nearestDatum1 = data[index];

    nearestDatum =
      nearestDatum1 &&
      (!nearestDatum0 ||
        Math.abs(dataValue - accessor(nearestDatum0)) > Math.abs(dataValue - accessor(nearestDatum1)))
        ? nearestDatum1
        : nearestDatum0;
    nearestDatumIndex = nearestDatum === nearestDatum0 ? index - 1 : index;
  } else if ('bandwidth' in scale && typeof scale.bandwidth !== 'undefined') {
    // band and point scales don't have an invert function but they do have discrete domains
    // so we manually invert. We detect this scale type by looking for the bandwidth() method.
    const domain = scale.domain();
    const range = scale.range().map(Number);
    const sortedRange = [...range].sort((a, b) => a - b); // bisectLeft assumes sort

    // band scale has inner padding and outer padding; point scale has only outer padding
    // (accessed as padding()).
    const rangeStart =
      'paddingInner' in scale && typeof scale.paddingInner !== 'undefined'
        ? sortedRange[0] + scale.step() * scale.paddingOuter() - scale.step() * scale.paddingInner() * 0.5
        : sortedRange[0] + scale.step() * scale.padding();

    const rangePoints = d3Range(rangeStart, sortedRange[1], scale.step());
    const domainIndex = bisectLeft(rangePoints, scaledValue);
    // y-axis scales may have reverse ranges, correct for this
    const sortedDomain = range[0] < range[1] ? domain : domain.reverse();
    const domainValue = sortedDomain[domainIndex - 1];
    const index = data.findIndex((datum) => String(accessor(datum)) === String(domainValue));
    nearestDatum = data[index];
    nearestDatumIndex = index;
  } else {
    console.warn('[findNearestDatumSingleDimension] encountered incompatible scale type, bailing');
    return null;
  }

  if (isNil(nearestDatum) || isNil(nearestDatumIndex)) {
    return null;
  }

  const distance = Math.abs(Number(scale(accessor(nearestDatum))) - scaledValue);

  return { datum: nearestDatum, index: nearestDatumIndex, distance };
}
