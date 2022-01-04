import { useMemo } from 'react';

import type { ChartArea, Margins } from '@/types';

export function useChartArea(svgWidth: number, svgHeight: number, margins: Margins): ChartArea {
  return useMemo(() => {
    const width = svgWidth - margins.left - margins.right;
    const height = svgHeight - margins.top - margins.bottom;
    const translateLeft = margins.left;
    const translateTop = margins.top;
    const translateRight = translateLeft + width;
    const translateBottom = translateTop + height;
    const xRange = [0, width] as const;
    const yRange = [height, 0] as const;
    const yRangeReversed = [0, height] as const;
    return {
      width,
      height,
      //   translate: { left, right, top, bottom }, // TODO think about this approach.
      //   range: { width, height, heightReversed }
      translateLeft,
      translateRight,
      translateTop,
      translateBottom,
      xRange,
      yRange,
      yRangeReversed
    };
  }, [svgWidth, svgHeight, margins.left, margins.right, margins.top, margins.bottom]);
}
