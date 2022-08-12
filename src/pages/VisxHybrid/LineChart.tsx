import type { LinearScaleConfig, UtcScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { curveCatmullRom } from 'd3-shape';
import { timeFormat } from 'd3-time-format';

import type { TimeValueDatum } from '@/types';
import { LineSeriesLinearGradient } from '@/visx-hybrid/LineSeriesLinearGradient';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
// import { SVGBarAnnotation } from '@/visx-hybrid/SVGBarAnnotation';
// import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
// import { SVGInterpolatedPath } from '@/visx-hybrid/SVGInterpolatedPath';
import { SVGLineSeries } from '@/visx-hybrid/SVGLineSeries';
import { SVGWipedPath } from '@/visx-hybrid/SVGWipedPath';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { darkTheme } from './darkTheme';

const independentScale: UtcScaleConfig<number> = {
  type: 'utc',
  nice: true,
  round: true,
  clamp: true
} as const;

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true
} as const;

function independentAccessor(d: TimeValueDatum<number>) {
  return d.date;
}

function dependentAccessor(d: TimeValueDatum<number>) {
  return d.value;
}

function keyAccessor(d: TimeValueDatum<number>) {
  return d.date.getTime();
}

const dependentAxisTickLabelFormatter = format(',.1~f');

const independentDatumLabelFormatter = timeFormat('%e %B %Y');

const springConfig = { duration: 350, easing: easeCubicInOut };

export interface LineChartProps {
  data: TimeValueDatum<number>[];
}

const gradientId = '__foo123';

export function LineChart({ data }: LineChartProps) {
  return (
    <SVGXYChart
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Bar chart"
      aria-label="Some Important Results"
      dependentRangePadding={10}
      // independentRangePadding={50}
      className="select-none"
      theme={darkTheme}
      outerMargin={20}
      // horizontal
    >
      <LineSeriesLinearGradient
        id={gradientId}
        segmentBoundaryData={data.length ? [data[1]] : null}
        segmentColors={[schemeCategory10[1], schemeCategory10[2]]}
        dataKeyRef="data-a"
      />
      <SVGGrid tickCount={5} variable="dependent" />
      <SVGLineSeries
        dataKey="data-a"
        data={data}
        independentAccessor={independentAccessor}
        dependentAccessor={dependentAccessor}
        keyAccessor={keyAccessor}
        curve={curveCatmullRom}
        color={schemeCategory10[4]}
        pathProps={{ strokeWidth: 4, stroke: `url(#${gradientId})` }}
        // component={SVGInterpolatedPath}
        component={SVGWipedPath}
      />
      {/* <SVGA11ySeries<CategoryValueDatum<string, number>>
        dataKeyOrKeysRef="data-a"
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${data[0].category}: ${data[0].value}`,
          'aria-roledescription': `Category ${category}`
        })}
      /> */}
      {/* <SVGAxis variable="independent" position="end" label="Foobar Topy" /> */}
      <SVGAxis variable="independent" position="start" label="Foobar Bottomy" tickLabelAlignment="angled" />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Foobar Lefty"
        tickCount={5}
        hideZero
        tickFormat={dependentAxisTickLabelFormatter}
      />
      <SVGAxis
        variable="dependent"
        position="end"
        label="Foobar Righty"
        tickCount={5}
        hideZero
        tickFormat={dependentAxisTickLabelFormatter}
      />
      {/* <SVGBarAnnotation datum={data[2]} dataKeyRef="data-a" /> */}
      <PopperTooltip<TimeValueDatum<number>>
        snapTooltipToDatumX
        showVerticalCrosshair
        showDatumGlyph
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum;
          return datum ? (
            <div>
              <span className="font-bold">{independentDatumLabelFormatter(datum.datum?.date)}</span>:{' '}
              {datum.datum?.value}
            </div>
          ) : null;
        }}
      />
    </SVGXYChart>
  );
}
