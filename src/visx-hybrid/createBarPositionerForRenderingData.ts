import { isValidNumber } from './isValidNumber';
import type { DatumPosition, IDataEntry, IScaleSet } from './types';

export function createBarPositionerForRenderingData<Datum extends object, RenderingDatum extends object>(
  scales: IScaleSet,
  dataEntry: IDataEntry<Datum, RenderingDatum>,
  horizontal: boolean
): (datum: RenderingDatum) => DatumPosition | null {
  const independent0Accessor = dataEntry.getIndependentAccessor(scales, 'start');
  const independent1Accessor = dataEntry.getIndependentAccessor(scales, 'end');
  const dependent0Accessor = dataEntry.getBaselineDependentAccessor(scales);
  const dependent1Accessor = dataEntry.getDependentAccessor(scales);

  return (datum: RenderingDatum) => {
    const independentStartCoord = independent0Accessor(datum);
    if (!isValidNumber(independentStartCoord)) {
      return null;
    }
    const independentEndCoord = independent1Accessor(datum);
    if (!isValidNumber(independentEndCoord)) {
      return null;
    }
    const dependentStartCoord = dependent0Accessor(datum);
    if (!isValidNumber(dependentStartCoord)) {
      return null;
    }
    const dependentEndCoord = dependent1Accessor(datum);
    if (!isValidNumber(dependentEndCoord)) {
      return null;
    }
    const independentCentreCoord =
      independentStartCoord + (independentEndCoord - independentStartCoord) * 0.5;
    return {
      baselineX: horizontal ? dependentStartCoord : independentStartCoord,
      baselineY: horizontal ? independentStartCoord : dependentStartCoord,
      datumX: horizontal ? dependentEndCoord : independentEndCoord,
      datumY: horizontal ? independentEndCoord : dependentEndCoord,
      pointX: horizontal ? dependentEndCoord : independentCentreCoord,
      pointY: horizontal ? independentCentreCoord : dependentEndCoord
    };
  };
}
