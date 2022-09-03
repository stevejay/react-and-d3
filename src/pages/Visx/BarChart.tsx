import { AnimatedAxis, AnimatedBarSeries, XYChart } from '@visx/xychart';

import { CategoryValueDatum } from '@/types';

export interface BarChartProps {
  data: CategoryValueDatum<string, number>[];
  width: number;
  height: number;
}

export function BarChart({ data, width, height }: BarChartProps) {
  return (
    <XYChart
      width={width}
      height={height}
      xScale={{ type: 'band', paddingInner: 0.3, paddingOuter: 0.2 }}
      yScale={{ type: 'linear' }}
    >
      <AnimatedBarSeries
        dataKey="data-a"
        data={data}
        xAccessor={(datum) => datum.category}
        yAccessor={(datum) => datum.value}
      />
      <AnimatedAxis
        orientation="left"
        hideAxisLine
        tickLabelProps={() => ({
          className: 'fill-slate-200 text-xs',
          textAnchor: 'end',
          verticalAnchor: 'middle'
        })}
      />
      <AnimatedAxis
        orientation="bottom"
        hideTicks
        axisLineClassName="stroke-slate-300"
        tickLength={10}
        tickLabelProps={() => ({
          className: 'fill-slate-200 text-sm',
          textAnchor: 'middle',
          verticalAnchor: 'start'
        })}
      />
    </XYChart>
  );
}
