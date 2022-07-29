import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueDatum, Margin } from '@/types';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGAxisRenderer } from '@/visx-hybrid/SVGAxisRenderer';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGFancyBarSeriesRenderer } from '@/visx-hybrid/SVGFancyBarSeriesRenderer';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
// import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { darkTheme } from './darkTheme';

export interface BarChartProps {
  data: CategoryValueDatum<string, number>[];
  margin: Margin;
}

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.9,
  paddingOuter: 0.2,
  round: true
} as const;

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true
} as const;

function independentAccessor(d: CategoryValueDatum<string, number>) {
  return d.category;
}

function dependentAccessor(d: CategoryValueDatum<string, number>) {
  return d.value;
}

function colorAccessor() {
  return schemeCategory10[8];
}

function keyAccessor(d: CategoryValueDatum<string, number>) {
  return d.category;
}

const springConfig = { duration: 350, easing: easeCubicInOut };

export function BarChart({ data }: BarChartProps) {
  return (
    <SVGXYChart
      // margin={margin}
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Bar chart"
      aria-label="Some Important Results"
      dependentRangePadding={30}
      independentRangePadding={20}
      className="select-none"
      theme={darkTheme}
      // horizontal
    >
      <SVGGrid tickCount={5} variableType="dependent" />
      {/* <SVGGrid className="text-red-600" tickCount={5} renderer={SVGGridRenderer} variableType="dependent" /> */}
      <SVGBarSeries
        renderer={SVGFancyBarSeriesRenderer<CategoryValueDatum<string, number>>}
        dataKey="data-a"
        data={data}
        keyAccessor={keyAccessor}
        independentAccessor={independentAccessor}
        dependentAccessor={dependentAccessor}
        colorAccessor={colorAccessor}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        barProps={(datum: CategoryValueDatum<string, number>) => ({
          role: 'graphics-symbol',
          'aria-roledescription': '',
          'aria-label': `Category ${independentAccessor(datum)}: ${dependentAccessor(datum)}`
        })}
        lineProps={{
          stroke: 'white',
          strokeWidth: 2
        }}
      />
      <SVGAxis
        renderer={SVGAxisRenderer}
        variableType="independent"
        position="end"
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
        // labelProps={{
        //   className: 'fill-slate-400 font-sans',
        //   // textAnchor: 'middle',
        //   // verticalAnchor: 'start',
        //   fontSize: 14
        // }}
        labelPadding={10}
      />
      <SVGAxis
        renderer={SVGAxisRenderer}
        variableType="independent"
        position="start"
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
        // labelProps={{
        //   // className: 'fill-slate-400 font-sans',
        //   // textAnchor: 'middle',
        //   // verticalAnchor: 'end',
        //   // fontSize: 14
        // }}
        labelPadding={10}
      />
      <SVGAxis
        renderer={SVGAxisRenderer}
        variableType="dependent"
        position="start"
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
        // labelAngle="horizontal"
        // labelProps={{
        //   className: 'fill-slate-400 font-sans',
        //   textAnchor: 'middle',
        //   fontSize: 14
        // }}
        // labelPadding={36} // Does not take tick labels into account.
        // labelPadding={10}
      />
      <SVGAxis
        renderer={SVGAxisRenderer}
        variableType="dependent"
        position="end"
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
        // labelAngle="horizontal"
        // labelProps={{
        //   className: 'fill-slate-400 font-sans',
        //   textAnchor: 'middle',
        //   fontSize: 14
        // }}
        // labelPadding={36} // Does not take tick labels into account.
        // labelPadding={10}
      />
      <PopperTooltip<CategoryValueDatum<string, number>>
        snapTooltipToDatumX
        showVerticalCrosshair
        showDatumGlyph={false}
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum;
          if (!datum) {
            return null;
          }
          return (
            <div>
              <span className="font-bold">{datum.datum?.category}</span>: {datum.datum?.value}
            </div>
          );
        }}
      />
    </SVGXYChart>
  );
}
