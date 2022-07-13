import { useMemo } from 'react';

import { ChartArea, Margin, Point } from '@/types';

export function useChartArea(svgWidth: number, svgHeight: number, margins: Margin, padding = 0): ChartArea {
  return useMemo(() => {
    const width = svgWidth - margins.left - margins.right;
    const height = svgHeight - margins.top - margins.bottom;
    const translateLeft = margins.left;
    const translateTop = margins.top;
    const translateRight = translateLeft + width;
    const translateBottom = translateTop + height;
    const rangeWidth = [padding, width - padding] as Point;
    const rangeHeight = [height - padding, padding] as Point;
    const rangeHeightReversed = [padding, height - padding] as Point;
    return {
      width,
      height,
      translateLeft,
      translateRight,
      translateTop,
      translateBottom,
      rangeWidth,
      rangeHeight,
      rangeHeightReversed
    };
  }, [svgWidth, svgHeight, margins.left, margins.right, margins.top, margins.bottom, padding]);
}
