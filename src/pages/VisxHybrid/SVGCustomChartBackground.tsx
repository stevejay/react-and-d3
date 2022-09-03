import { PatternLines } from '@visx/pattern';

import { useXYChartContext } from '../../visx-hybrid/useXYChartContext';

const patternId = 'xy-chart-pattern';

export function SVGCustomChartBackground() {
  const {
    chartDimensions: { chartAreaExcludingRangePadding }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useXYChartContext<any, any>();
  return (
    <>
      <PatternLines
        id={patternId}
        width={16}
        height={16}
        orientation={['diagonal']}
        stroke="#555"
        strokeWidth={1}
      />
      <rect
        x={chartAreaExcludingRangePadding.x}
        y={chartAreaExcludingRangePadding.y}
        width={chartAreaExcludingRangePadding.width}
        height={chartAreaExcludingRangePadding.height}
        fill={`url(#${patternId})`}
        fillOpacity={0.3}
      />
    </>
  );
}
