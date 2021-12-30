import { FC, useMemo } from 'react';
import type { AxisDomain, AxisScale } from 'd3';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from '@/Svg';
import { SvgAxis } from '@/SvgAxis';
import { SvgBars } from '@/SvgBars';
import type { Margins } from '@/types';

export type Datum = { category: string; value: number };

type HorizontalBarChartProps = {
  data: Datum[];
  width: number;
  height: number;
  margins: Margins;
};

export const HorizontalBarChart: FC<HorizontalBarChartProps> = ({ data, width, height, margins }) => {
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const valueScale = useMemo<AxisScale<number>>(
    () => d3.scaleLinear([0, d3.max(data, (d) => d.value) ?? 0], [0, chartWidth]).nice(),
    [data, chartWidth]
  );

  const categoryScale = useMemo<AxisScale<string>>(
    () =>
      d3
        .scaleBand(
          data.map((d) => d.category),
          [0, chartHeight]
        )
        .paddingInner(0.3)
        .paddingOuter(0.2),
    [data, chartHeight]
  );

  if (!width || !height) {
    return null;
  }

  return (
    <MotionConfig transition={{ duration: 0.5, ease: d3.easeCubicInOut }}>
      <Svg width={width} height={height} className="font-sans select-none">
        <SvgAxis
          scale={valueScale}
          translateX={margins.left}
          translateY={margins.top + chartHeight}
          orientation="bottom"
          tickSizeOuter={0}
          tickSizeInner={-chartHeight}
          tickPadding={10}
          className="text-[10px]"
          domainClassName="text-transparent"
          tickLineClassName="text-slate-600"
          tickTextClassName="text-slate-200"
        />
        <SvgAxis
          scale={categoryScale}
          translateX={margins.left}
          translateY={margins.top}
          orientation="left"
          tickSizeInner={0}
          tickPadding={10}
          className="text-sm"
          domainClassName="text-slate-400"
          // tickTextProps={{ transform: 'translate(-10,0)rotate(-45)', style: { textAnchor: 'end' } }}
        />
        <SvgBars
          data={data}
          translateX={margins.left}
          translateY={margins.top}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          orientation="horizontal"
          categoryScale={categoryScale as AxisScale<AxisDomain>}
          valueScale={valueScale as AxisScale<AxisDomain>}
          className="text-slate-600"
        />
      </Svg>
    </MotionConfig>
  );
};
