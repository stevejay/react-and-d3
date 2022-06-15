// import { GridRows } from '@visx/grid';
// import { Group } from '@visx/group';
import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueDatum, Margin } from '@/types';
import { SvgXYChartAxis } from '@/visx-next/Axis';
import { XYChartBarSeries } from '@/visx-next/BarSeries';
import { XYChartRowGrid } from '@/visx-next/RowGrid';
import { SvgXYChart } from '@/visx-next/SvgXYChart';

export interface BarChartProps {
  data: CategoryValueDatum<string, number>[];
  margin: Margin;
}

const xScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.9,
  paddingOuter: 0.2,
  round: true
} as const;

// You can control the behavior more precisely by turning off crispEdges and instead positioning the ticks exactly on half-pixel boundaries, say by using scale.rangeRound and then offsetting the tick position by a half-pixel. However, note that in Firefox the SVG element itself can be positioned on a sub-pixel boundary, which then requires further offsetting to get the tick back on a whole-pixel. :\

const yScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;

function xAccessor(d: CategoryValueDatum<string, number>) {
  return d.category;
}

function yAccessor(d: CategoryValueDatum<string, number>) {
  return d.value;
}

function colorAccessor(d: CategoryValueDatum<string, number>) {
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
      return 'black';
  }
}

const springConfig = { duration: 350, easing: easeCubicInOut };

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

  // TODO I really think the scales and accessors should be labelled
  // independent and dependent.

  return (
    <SvgXYChart
      margin={margin}
      xScale={xScale}
      yScale={yScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-label="Some title"
    >
      {/* <Grid rows columns tickCount={2} className="text-slate-600" /> */}
      {/* <XYChartColumnGrid className="text-slate-600" /> */}
      <XYChartRowGrid className="text-red-600" tickCount={5} shapeRendering="crispEdges" />
      {/* TODO Use refs within barSeries for the accessors? */}
      <XYChartBarSeries
        dataKey="data-a"
        data={data}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        colorAccessor={colorAccessor as (d: object) => string}
        barProps={{ shapeRendering: 'crispEdges' }}
      />
      <SvgXYChartAxis
        orientation="top"
        label="Foobar Top"
        hideTicks
        tickLabelPadding={6}
        tickLabelProps={{
          className: 'fill-slate-400 font-sans',
          fontSize: 12,
          textAnchor: 'middle',
          verticalAnchor: 'end',
          angle: 0
        }}
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        labelOffset={10}
      />
      <SvgXYChartAxis
        orientation="bottom"
        label="Foobar Bottom"
        hideTicks
        tickLabelPadding={6}
        tickLabelProps={{
          className: 'fill-slate-400 font-sans',
          fontSize: 12,
          textAnchor: 'middle',
          verticalAnchor: 'start',
          angle: 0
        }}
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        labelOffset={10}
      />
      <SvgXYChartAxis
        orientation="left"
        label="Foobar Left"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
        tickLabelProps={{
          className: 'fill-slate-400 font-sans',
          fontSize: 12,
          textAnchor: 'end',
          verticalAnchor: 'middle',
          angle: -45
        }}
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          // verticalAnchor: 'end',
          fontSize: 14
        }}
        labelOffset={36} // Does not take tick labels into account.
      />
      <SvgXYChartAxis
        orientation="right"
        label="Foobar Right"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
        tickLabelProps={{
          className: 'fill-slate-400 font-sans',
          fontSize: 12,
          textAnchor: 'start',
          verticalAnchor: 'middle',
          angle: -45
        }}
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          // verticalAnchor: 'end',
          fontSize: 14
        }}
        labelOffset={36} // Does not take tick labels into account.
        // hideTicks
        // tickLength={0}
      />
    </SvgXYChart>
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
