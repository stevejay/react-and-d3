import { isNil } from './isNil';
import type { DatumPosition, PolygonTransition } from './types';

export function createPolygonTransition(
  args: DatumPosition | null
): Omit<PolygonTransition, 'opacity'> | null {
  if (isNil(args)) {
    return null;
  }
  const { baselineX, baselineY, datumX, datumY } = args;
  return {
    x1: baselineX,
    y1: baselineY,
    x2: datumX,
    y2: datumY,
    points: `${baselineX},${baselineY} ${datumX},${baselineY} ${datumX},${datumY} ${baselineX},${datumY}`
  };
}
