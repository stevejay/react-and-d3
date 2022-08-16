import { PatternLines } from '@visx/pattern';

import { useXYChartContext } from '../../visx-hybrid/useXYChartContext';

const patternId = 'xy-chart-pattern';

export function SVGCustomChartBackground() {
  const {
    margin,
    innerWidth,
    innerHeight
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
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        fill={`url(#${patternId})`}
        fillOpacity={0.3}
      />
    </>
  );
}
