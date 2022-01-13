import { useMemo } from 'react';

import type { ChartArea, Margins } from '@/types';

export function useChartArea(
  svgWidth: number,
  svgHeight: number,
  margins: Margins,
  padding: number = 0
): ChartArea {
  return useMemo(() => {
    const width = svgWidth - margins.left - margins.right;
    const height = svgHeight - margins.top - margins.bottom;
    const translateLeft = margins.left;
    const translateTop = margins.top;
    const translateRight = translateLeft + width;
    const translateBottom = translateTop + height;
    const rangeWidth = [padding, width - padding] as const;
    const rangeHeight = [height - padding, padding] as const;
    const rangeHeightReversed = [padding, height - padding] as const;
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
