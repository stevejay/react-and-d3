import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueDatum, Margin } from '@/types';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
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
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Bar chart"
      aria-label="Some Important Results"
      dependentRangePadding={50}
      independentRangePadding={50}
      className="select-none"
      theme={darkTheme}
      // horizontal
    >
      <SVGGrid tickCount={5} variable="dependent" />
      {/* <SVGGrid className="text-red-600" tickCount={5} renderer={SVGGridRenderer} variable="dependent" /> */}
      <SVGBarSeries
        dataKey="data-a"
        data={data}
        keyAccessor={keyAccessor}
        independentAccessor={independentAccessor}
        dependentAccessor={dependentAccessor}
        colorAccessor={colorAccessor}
        component={
          SVGBarWithLine
          // {...props}
          // barProps={(datum) => ({
          //   role: 'graphics-symbol',
          //   'aria-roledescription': '',
          //   'aria-label': `Category ${independentAccessor(datum)}: ${dependentAccessor(datum)}`
          // })}
        }
        // barProps={(datum) => ({
        //   role: 'graphics-symbol',
        //   'aria-roledescription': '',
        //   'aria-label': `Category ${independentAccessor(datum)}: ${dependentAccessor(datum)}`
        // })}
        // lineProps={{
        //   stroke: 'white',
        //   strokeWidth: 2
        // }}
      />
      <SVGAxis
        variable="independent"
        position="end"
        label="Foobar Topy"
        // hideAxisPath
        // hideTicks
        // tickLength={20}
        // tickLabelPadding={20}
        // tickLabelAngle="angled"
        // autoMarginLabelPadding={0}
        // labelAngle="vertical"
      />
      <SVGAxis
        variable="independent"
        position="start"
        label="Foobar Bottomy"
        // hideAxisPath
        // outerTickLength={20}
        // hideTicks
        // tickLength={20}
        // tickLabelPadding={10}
        // tickLabelAngle="angled"
        // autoMarginLabelPadding={0}
        // labelAngle="vertical"
      />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Foobar Lefty"
        tickCount={5}
        hideZero
        // hideAxisPath

        // tickLength={20}
        // tickLabelPadding={10}
        // tickLabelAngle="angled"
        // autoMarginLabelPadding={0}
        // labelAngle="horizontal"
      />
      <SVGAxis
        variable="dependent"
        position="end"
        label="Foobar Righty"
        tickCount={5}
        hideZero
        // hideAxisPath

        // tickLength={20}
        // tickLabelPadding={10}
        // tickLabelAngle="angled"
        // autoMarginLabelPadding={0}
        // labelAngle="horizontal"
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
