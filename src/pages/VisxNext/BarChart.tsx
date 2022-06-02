import { Key } from 'react';
// import { GridRows } from '@visx/grid';
// import { Group } from '@visx/group';
import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueDatum, Margin } from '@/types';
import BarSeries from '@/visx-next/BarSeries';
import { Grid } from '@/visx-next/Grid';
import { GridColumns } from '@/visx-next/GridColumns';
import { GridRows } from '@/visx-next/GridRows';
import { XyChart } from '@/visx-next/XyChart';

export interface BarChartProps {
  data: CategoryValueDatum<string, number>[];
  margin: Margin;
  // width: number;
  // height: number;
}

const xScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.3,
  paddingOuter: 0.2,
  round: true
} as const;

const yScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;

const xAccessor = (d: CategoryValueDatum<string, number>) => d.category;
const yAccessor = (d: CategoryValueDatum<string, number>) => d.value;
const zAccessor = (d: CategoryValueDatum<string, number>) => {
  switch (d.category) {
    case 'A':
      return schemeCategory10[0];
    case 'B':
      return schemeCategory10[1];
    case 'C':
      return schemeCategory10[2];
    case 'D':
      return schemeCategory10[3];
    case 'E':
      return schemeCategory10[4];
    default:
      return '#000';
  }
};

export function BarChart({ data, margin }: BarChartProps) {
  // const categoryScale = scaleBand<string>({
  //   domain: data.map((datum) => datum.category),
  //   paddingInner: 0.3,
  //   paddingOuter: 0.2
  // });

  // const valueScale = scaleLinear<number>({
  //   domain: [0, Math.max(...data.map((datum) => datum.value))],
  //   nice: true,
  //   clamp: true
  // });

  // const xMax = width - margins.left - margins.right;
  // const yMax = height - margins.top - margins.bottom;

  // categoryScale.rangeRound([0, xMax]);
  // valueScale.range([yMax, 0]);

  return (
    <XyChart margin={margin} xScale={xScale} yScale={yScale}>
      <Grid rows columns GridRowsComponent={GridRows} GridColumnsComponent={GridColumns} numTicks={5} />
      {/* TODO Use refs within barSeries for the accessors? */}
      <BarSeries
        dataKey="data-a"
        data={data}
        keyAccessor={xAccessor as (d: object) => Key}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        // getBarProps={(d) => ({ fill: zAccessor(d) })}
        colorAccessor={zAccessor as (d: object) => string}
      />
    </XyChart>
  );

  // return (
  //   <svg width={width} height={height}>
  //     <rect x={0} y={0} width={width} height={height} className="fill-slate-800" rx={14} />
  //     <AnimatedAxis
  //       orientation="left"
  //       top={margins.top}
  //       left={margins.left}
  //       scale={valueScale}
  //       // axisLineClassName="stroke-slate-300"
  //       hideAxisLine
  //       // tickLineProps={{
  //       //   width: -xMax,
  //       //   className: 'stroke-slate-300'
  //       // }}
  //       // tickLength={-xMax}
  //       tickLabelProps={() => ({
  //         className: 'fill-slate-200 text-xs',
  //         textAnchor: 'end',
  //         verticalAnchor: 'middle'
  //       })}
  //     />
  //     <Group top={margins.top} left={margins.left}>
  //       <GridRows
  //         scale={valueScale}
  //         width={xMax}
  //         height={yMax}
  //         stroke="currentColor"
  //         className="text-slate-600"
  //       />
  //     </Group>
  //     <AnimatedAxis
  //       orientation="bottom"
  //       top={yMax + margins.top}
  //       left={margins.left}
  //       scale={categoryScale}
  //       hideTicks
  //       axisLineClassName="stroke-slate-300"
  //       tickLength={10}
  //       tickLabelProps={() => ({
  //         className: 'fill-slate-200 text-sm',
  //         textAnchor: 'middle',
  //         verticalAnchor: 'start'
  //       })}
  //     />
  //   </svg>
  // );
}
