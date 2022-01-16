import { useMemo } from 'react';
import { Delaunay } from 'd3-delaunay';

export function useDelaunay<DatumT>(
  data: DatumT[],
  getX: (datum: DatumT) => number,
  getY: (datum: DatumT) => number
) {
  return useMemo(() => Delaunay.from(data, getX, getY), [data, getX, getY]);
}
