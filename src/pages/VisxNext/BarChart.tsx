import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { curveCatmullRom } from 'd3-shape';

import { CategoryValueDatum, Margin } from '@/types';
import { SvgXYChartAxis } from '@/visx-next/Axis';
import { XYChartBarSeries } from '@/visx-next/BarSeries';
import { CircleGlyph } from '@/visx-next/glyphs/CircleGlyph';
import { XYChartGlyphSeries } from '@/visx-next/GlyphSeries';
import { XYChartLineSeries } from '@/visx-next/LineSeries';
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

function colorAccessor() {
  return schemeCategory10[8];
}

function glyphColorAccessor() {
  return schemeCategory10[6];
}

function keyAccessor(d: CategoryValueDatum<string, number>) {
  return d.category;
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
      {false && (
        <XYChartBarSeries
          dataKey="data-a"
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          colorAccessor={colorAccessor}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          barProps={(datum) => ({
            shapeRendering: 'crispEdges',
            role: 'graphics-symbol',
            'aria-roledescription': '',
            'aria-label': `Category ${xAccessor(datum as CategoryValueDatum<string, number>)}: ${yAccessor(
              datum as CategoryValueDatum<string, number>
            )}`
          })}
        />
      )}
      {false && (
        <XYChartGlyphSeries
          size={5}
          dataKey="data-b"
          data={data}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          keyAccessor={keyAccessor}
          colorAccessor={glyphColorAccessor}
          renderGlyph={({ datum, ...rest }) => (
            <CircleGlyph
              shapeRendering="crispEdges"
              role="graphics-symbol"
              aria-roledescription=""
              aria-label={`Category ${xAccessor(datum as CategoryValueDatum<string, number>)}: ${yAccessor(
                datum as CategoryValueDatum<string, number>
              )}`}
              {...rest}
            />
          )}
        />
      )}
      <XYChartLineSeries
        dataKey="data-c"
        data={data}
        keyAccessor={keyAccessor}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        curve={curveCatmullRom}
        pathProps={{
          stroke: schemeCategory10[3],
          strokeWidth: 3,
          strokeLinecap: 'round' // without this a datum surrounded by nulls will not be visible
        }}
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
        // tickLineProps={{ shapeRendering: 'crispEdges' }}
        // domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelPadding={10}
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
        // tickLineProps={{ shapeRendering: 'crispEdges' }}
        // domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelPadding={10}
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
        // tickLineProps={{ shapeRendering: 'crispEdges' }}
        // domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelPadding={36} // Does not take tick labels into account.
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
        // tickLineProps={{ shapeRendering: 'crispEdges' }}
        // domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelPadding={36} // Does not take tick labels into account.
        // hideTicks
        // tickLength={0}
      />
    </SvgXYChart>
  );
}
