import { LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { Margin } from '@/types';
import { SvgXYChartAxis } from '@/visx-next/Axis';
import { CircleGlyph } from '@/visx-next/glyphs/CircleGlyph';
import { XYChartGlyphSeries } from '@/visx-next/GlyphSeries';
import { PopperTooltip } from '@/visx-next/PopperTooltip';
import { XYChartRowGrid } from '@/visx-next/RowGrid';
import { SvgXYChart } from '@/visx-next/SvgXYChart';

export interface Datum {
  a: number;
  b: number;
}

export interface GlyphSeriesChartProps {
  data: Datum[];
  margin: Margin;
}

const xScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;
const yScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;

function xAccessor(d: Datum) {
  return d.a;
}

function yAccessor(d: Datum) {
  return d.b;
}

function colorAccessor() {
  return schemeCategory10[8];
}

function keyAccessor(d: Datum) {
  return `${d.a} ${d.b}`;
}

const springConfig = { duration: 350, easing: easeCubicInOut };

// TODO I really think the scales and accessors should be labelled
// independent and dependent.
export function GlyphSeriesChart({ data, margin }: GlyphSeriesChartProps) {
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
      <XYChartGlyphSeries
        size={5}
        dataKey="data-b"
        data={data}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        keyAccessor={keyAccessor}
        colorAccessor={colorAccessor}
        renderGlyph={({ datum, ...rest }) => (
          <CircleGlyph
            shapeRendering="crispEdges"
            role="graphics-symbol"
            aria-roledescription=""
            aria-label={`Category ${xAccessor(datum as Datum)}: ${yAccessor(datum as Datum)}`}
            {...rest}
          />
        )}
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
      <PopperTooltip<Datum>
        snapTooltipToDatumX //={false}
        snapTooltipToDatumY //={false}
        showVerticalCrosshair //={false}
        // showSeriesGlyphs
        showDatumGlyph
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum;
          if (!datum) {
            return null;
          }
          return (
            <div>
              <div style={{ color: colorAccessor() }}>{datum.key}</div>
              {xAccessor(datum.datum)}
              {', '}
              {yAccessor(datum.datum)}
            </div>
          );
        }}
      />
    </SvgXYChart>
  );
}
