import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';

import type { CategoryValueDatum } from '@/types';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGA11ySeries } from '@/visx-hybrid/SVGA11ySeries';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarAnnotation } from '@/visx-hybrid/SVGBarAnnotation';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGlyphSeries } from '@/visx-hybrid/SVGGlyphSeries';
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
};

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true
};

const glyphZScale: LinearScaleConfig<number> = {
  type: 'linear',
  clamp: true,
  range: [5, 15],
  domain: [-100, 100]
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
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Bar chart"
      aria-label="Some Important Results"
      dependentRangePadding={50}
      independentRangePadding={50}
      className="select-none"
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
        component={SVGBarWithLine}
      />
      <SVGBarSeriesLabels dataKeyRef="data-a" formatter={dependentAxisTickLabelFormatter} />
      <SVGGlyphSeries
        dataKey="data-b"
        data={data}
        independentAccessor={independentAccessor}
        dependentAccessor={dependentAccessor}
        // radius={10}
        radiusScale={glyphZScale}
        radiusAccessor={dependentAccessor}
        // colorAccessor={colorAccessor}
        enableEvents={false}
        // component={SVGGlyph}
      />
      <SVGA11ySeries<CategoryValueDatum<string, number>>
        dataKeyOrKeysRef="data-a"
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${data[0].category}: ${data[0].value}`,
          'aria-roledescription': `Category ${category}`
        })}
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
      />
      <SVGAxis
        variable="dependent"
        position="end"
        label="Foobar Righty"
        tickCount={5}
        hideZero
        tickFormat={dependentAxisTickLabelFormatter}
      />
      <SVGBarAnnotation datum={data[2]} dataKeyRef="data-a" />
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
