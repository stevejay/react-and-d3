import { useMemo } from 'react';

import type { ChartArea, Margins } from './types';

export function useChartArea(svgWidth: number, svgHeight: number, margins: Margins): ChartArea {
  const width = svgWidth - margins.left - margins.right;
  const height = svgHeight - margins.top - margins.bottom;
  const translateX = margins.left;
  const translateY = margins.top;
  const xRange = useMemo(() => [0, width] as const, [width]);
  const yRange = useMemo(() => [height, 0] as const, [height]);
  return { width, height, translateX, translateY, xRange, yRange };
}
