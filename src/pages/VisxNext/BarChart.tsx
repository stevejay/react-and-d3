import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';

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

const yScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;

function xAccessor(d: CategoryValueDatum<string, number>) {
  return d.category;
}

function yAccessor(d: CategoryValueDatum<string, number>) {
  return d.value;
}

const springConfig = { duration: 350, easing: easeCubicInOut };

// TODO I really think the scales and accessors should be labelled
// independent and dependent.
export function BarChart({ data, margin }: BarChartProps) {
  return (
    <SvgXYChart
      margin={margin}
      xScale={xScale}
      yScale={yScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Bar chart"
      aria-label="Some Important Results"
      yRangePadding={30}
    >
      {/* <XYChartColumnGrid className="text-slate-600" /> */}
      <XYChartRowGrid className="text-red-600" tickCount={5} shapeRendering="crispEdges" />
      {/* TODO Use refs within barSeries for the accessors? */}
      <XYChartBarSeries
        dataKey="data-a"
        data={data}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        barProps={(datum: any) => ({
          shapeRendering: 'crispEdges',
          role: 'graphics-symbol',
          'aria-roledescription': '',
          'aria-label': `Category ${xAccessor(datum)}: ${yAccessor(datum)}`
        })}
        // groupProps={{
        //   role: 'graphics-object',
        //   'aria-roledescription': 'series',
        //   'aria-label': 'Some series'
        // }}
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
        tickLineProps={{ shapeRendering: 'crispEdges' }}
        domainPathProps={{ shapeRendering: 'crispEdges' }}
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
        tickLineProps={{ shapeRendering: 'crispEdges' }}
        domainPathProps={{ shapeRendering: 'crispEdges' }}
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
          fontSize: 14
        }}
        tickLineProps={{ shapeRendering: 'crispEdges' }}
        domainPathProps={{ shapeRendering: 'crispEdges' }}
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
          fontSize: 14
        }}
        tickLineProps={{ shapeRendering: 'crispEdges' }}
        domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelOffset={36} // Does not take tick labels into account.
        // hideTicks
        // tickLength={0}
      />
    </SvgXYChart>
  );
}
