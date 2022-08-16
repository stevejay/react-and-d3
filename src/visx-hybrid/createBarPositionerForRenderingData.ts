import { isValidNumber } from './isValidNumber';
import type { DatumPosition, IDataEntry, ScaleSet } from './types';

export function createBarPositionerForRenderingData<Datum extends object, RenderingDatum extends object>(
  scales: ScaleSet,
  dataEntry: IDataEntry<Datum, RenderingDatum>,
  horizontal: boolean
): (datum: RenderingDatum) => DatumPosition | null {
  const accessors = dataEntry.getBarAccessorsForRenderingData(scales);
  return (datum: RenderingDatum) => {
    const independentStartCoord = accessors.independent0(datum);
    if (!isValidNumber(independentStartCoord)) {
      return null;
    }
    const independentEndCoord = accessors.independent(datum);
    if (!isValidNumber(independentEndCoord)) {
      return null;
    }
    const dependentStartCoord = accessors.dependent0(datum);
    if (!isValidNumber(dependentStartCoord)) {
      return null;
    }
    const dependentEndCoord = accessors.dependent1(datum);
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
