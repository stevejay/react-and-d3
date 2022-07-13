import { LinearScaleConfig, UtcScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { curveCatmullRom } from 'd3-shape';

import { Margin, TimeValueDatum } from '@/types';
import { XYChartLineSeries } from '@/visx-next/LineSeries';
import { SvgXYChart } from '@/visx-next/SvgXYChart';

export interface SparklineProps {
  data: TimeValueDatum<number>[];
  margin: Margin;
}

const xScale: UtcScaleConfig<number> = { type: 'utc', nice: true, round: true, clamp: true } as const;
const yScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;

function xAccessor(d: TimeValueDatum<number>) {
  return d.date;
}

function yAccessor(d: TimeValueDatum<number>) {
  return d.value;
}

function keyAccessor(d: TimeValueDatum<number>) {
  return d.date.getTime().toString();
}

const springConfig = { duration: 350, easing: easeCubicInOut };

export function Sparkline({ data, margin }: SparklineProps) {
  return (
    <SvgXYChart
      margin={margin}
      xScale={xScale}
      yScale={yScale}
      springConfig={springConfig}
      aria-hidden
      role="presentation"
    >
      <XYChartLineSeries
        dataKey="data-a"
        data={data}
        keyAccessor={keyAccessor}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        curve={curveCatmullRom}
        animationType="dashoffset"
        pathProps={{
          stroke: schemeCategory10[4],
          strokeWidth: 15,
          strokeLinecap: 'round'
        }}
      />
    </SvgXYChart>
  );
}
