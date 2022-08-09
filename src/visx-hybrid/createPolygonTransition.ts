import { isNil } from 'lodash-es';

import type { PolygonTransition } from './types';

export function createPolygonTransition(
  args: {
    baselineX: number;
    baselineY: number;
    datumX: number;
    datumY: number;
  } | null
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
