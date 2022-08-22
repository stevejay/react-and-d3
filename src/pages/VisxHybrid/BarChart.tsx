import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { curveCatmullRom } from 'd3-shape';

import type { CategoryValueDatum } from '@/types';
import { SVGAreaAnnotation } from '@/visx-hybrid/SVGAreaAnnotation';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
// import { SVGInterpolatedPath } from '@/visx-hybrid/SVGInterpolatedPath';
import { SVGLineSeries } from '@/visx-hybrid/SVGLineSeries';
import { SVGSwipedPath } from '@/visx-hybrid/SVGSwipedPath';
import { SVGTooltip } from '@/visx-hybrid/SVGTooltip';
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
};

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true
};

const alternateDependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true
};

function independentAccessor(datum: CategoryValueDatum<string, number>) {
  return datum.category;
}

function dependentAccessor(datum: CategoryValueDatum<string, number>) {
  return datum.value;
}

function colorAccessor() {
  return schemeCategory10[4];
}

const dependentAxisTickLabelFormatter = format(',.1~f');

const springConfig = { duration: 350, easing: easeCubicInOut };

export function BarChart({ data }: BarChartProps) {
  return (
    <SVGXYChart
      independentScale={independentScale}
      dependentScale={dependentScale}
      alternateDependentScale={alternateDependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Bar chart"
      aria-label="Some Important Results"
      dependentRangePadding={50}
      independentRangePadding={50}
      theme={darkTheme}
      outerMargin={{ top: 20, bottom: 20, left: 20, right: 20 }}
      // horizontal
    >
      <SVGGrid tickCount={5} variable="dependent" />
      <SVGBarSeries
        dataKey="data-a"
        data={data}
        independentAccessor={independentAccessor}
        dependentAccessor={dependentAccessor}
        colorAccessor={colorAccessor}
        renderBar={SVGBarWithLine}
      />
      <SVGBarSeriesLabels dataKeyRef="data-a" formatter={dependentAxisTickLabelFormatter} />
      <SVGIndependentScaleA11ySeries<CategoryValueDatum<string, number>>
        dataKeyOrKeysRef="data-a"
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${data[0].category}: ${data[0].value}`,
          'aria-roledescription': `Category ${category}`
        })}
      />
      <SVGLineSeries
        dataKey="data-b"
        data={data}
        independentAccessor={independentAccessor}
        alternateDependentAccessor={dependentAccessor}
        renderPath={(props) => (
          <SVGSwipedPath {...props} strokeWidth={4} stroke="red" curve={curveCatmullRom} />
        )}
      />
      <SVGAxis variable="independent" position="end" label="Foobar Topy" />
      <SVGAxis variable="independent" position="start" label="Foobar Bottomy" />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Foobar Lefty"
        tickCount={5}
        hideZero
        tickFormat={dependentAxisTickLabelFormatter}
        // autoMarginLabelPadding={44}
        // outerTickLength={8}
        // includeRangePaddingInAxisPath={false}
      />
      <SVGAxis
        variable="alternateDependent"
        position="end"
        label="Foobar Righty"
        tickCount={5}
        hideZero
        tickFormat={dependentAxisTickLabelFormatter}
        // outerTickLength={8}
        // includeRangePaddingInAxisPath={false}
      />
      <SVGAreaAnnotation datum={data[2]} dataKeyRef="data-a" />
      <SVGTooltip<CategoryValueDatum<string, number>>
        snapTooltipToDatumX
        showVerticalCrosshair
        showDatumGlyph={false}
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum?.datum;
          return datum ? (
            <div>
              <span className="font-bold">{datum.category}</span>: {datum.value ?? '--'}
            </div>
          ) : null;
        }}
      />
    </SVGXYChart>
  );
}
