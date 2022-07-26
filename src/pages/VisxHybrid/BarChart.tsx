import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueDatum, Margin } from '@/types';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGAxisRenderer } from '@/visx-hybrid/SVGAxisRenderer';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGFancyBarSeriesRenderer } from '@/visx-hybrid/SVGFancyBarSeriesRenderer';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGGridRenderer } from '@/visx-hybrid/SVGGridRenderer';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

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

// TODO I really think the scales and accessors should be labelled
// independent and dependent.
export function BarChart({ data, margin }: BarChartProps) {
  return (
    <SVGXYChart
      margin={margin}
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Bar chart"
      aria-label="Some Important Results"
      dependentRangePadding={30}
      // horizontal
    >
      <rect x="120" width="100" height="100" rx="15" fill="blue" style={{ transform: 'scale(-1,1)' }} />
      <SVGGrid className="text-red-600" tickCount={5} renderer={SVGGridRenderer} variableType="dependent" />
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
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        // tickLineProps={{ shapeRendering: 'crispEdges' }}
        // domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelOffset={10}
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
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        // tickLineProps={{ shapeRendering: 'crispEdges' }}
        // domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelOffset={10}
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
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        labelOffset={36} // Does not take tick labels into account.
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
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        labelOffset={36} // Does not take tick labels into account.
      />
    </SVGXYChart>
  );
}
