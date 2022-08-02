import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueDatum } from '@/types';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { darkTheme } from './darkTheme';

export interface BarChartProps {
  data: CategoryValueDatum<string, number>[];
}

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.3,
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
      <SVGBarSeries
        dataKey="data-a"
        data={data}
        keyAccessor={keyAccessor}
        independentAccessor={independentAccessor}
        dependentAccessor={dependentAccessor}
        colorAccessor={colorAccessor}
        component={SVGBarWithLine}
        categoryA11yProps={(category: string, data: readonly CategoryValueDatum<string, number>[]) => {
          const datum = data[0];
          return {
            'aria-label': `Category ${datum.category}: ${datum.value}`,
            'aria-roledescription': `Category ${category}`
          };
        }}
      />
      <SVGAxis variable="independent" position="end" label="Foobar Topy" />
      <SVGAxis variable="independent" position="start" label="Foobar Bottomy" />
      <SVGAxis variable="dependent" position="start" label="Foobar Lefty" tickCount={5} hideZero />
      <SVGAxis variable="dependent" position="end" label="Foobar Righty" tickCount={5} hideZero />
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
