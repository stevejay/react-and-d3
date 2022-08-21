import { isValidNumber } from './isValidNumber';
import type { DatumPosition, IDataEntry, IScaleSet } from './types';

export function createBarPositionerForRenderingData<Datum extends object, RenderingDatum extends object>(
  scales: IScaleSet,
  dataEntry: IDataEntry<Datum, RenderingDatum>,
  horizontal: boolean
): (datum: RenderingDatum) => DatumPosition | null {
  const independent0Accessor = dataEntry.getIndependent0Accessor(scales);
  const independent1Accessor = dataEntry.getIndependent1Accessor(scales);
  const dependent0Accessor = dataEntry.getDependent0Accessor(scales);
  const dependent1Accessor = dataEntry.getDependent1Accessor(scales);

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
