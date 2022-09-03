import { useId } from 'react';
import { LinearScaleConfig, UtcScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { curveCatmullRom } from 'd3-shape';
import { timeFormat } from 'd3-time-format';

import type { TimeValueDatum } from '@/types';
import { createResourceUrlFromId } from '@/visx-hybrid/createResourceUrlFromId';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGCircleGlyph } from '@/visx-hybrid/SVGCircleGlyph';
import { SVGGlyphSeries } from '@/visx-hybrid/SVGGlyphSeries';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
import { SVGLinearGradient } from '@/visx-hybrid/SVGLinearGradient';
import { SVGLineSeries } from '@/visx-hybrid/SVGLineSeries';
import { SVGPointAnnotation } from '@/visx-hybrid/SVGPointAnnotation';
import { SVGPointSeriesLabels } from '@/visx-hybrid/SVGPointSeriesLabels';
import { SVGSwipedPath } from '@/visx-hybrid/SVGSwipedPath';
import { SVGTooltip } from '@/visx-hybrid/SVGTooltip';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { defaultTheme } from './defaultTheme';

const independentScaleConfig: UtcScaleConfig<number> = {
  type: 'utc',
  nice: true,
  round: true,
  clamp: true
} as const;

const dependentScaleConfig: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true
} as const;

// const glyphSizeScale = createScale({
//   type: 'linear',
//   clamp: true,
//   range: [5, 15],
//   domain: [-100, 100]
// } as LinearScaleConfig<number>);

function independentAccessor(d: TimeValueDatum<number>) {
  return d.date;
}

function dependentAccessor(d: TimeValueDatum<number>) {
  return d.value;
}

const dependentAxisTickLabelFormatter = format(',.1~f');

const independentDatumLabelFormatter = timeFormat('%e %B %Y');

const springConfig = { duration: 350, easing: easeCubicInOut };

export interface LineChartProps {
  data: TimeValueDatum<number>[];
}

export function LineChart({ data }: LineChartProps) {
  const linearGradientId = useId();
  return (
    <SVGXYChart
      independentScale={independentScaleConfig}
      dependentScale={dependentScaleConfig}
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Bar chart"
      aria-label="Some Important Results"
      dependentRangePadding={10}
      independentRangePadding={10}
      theme={defaultTheme}
      // outerMargin={20}
      // horizontal
    >
      <SVGLinearGradient
        id={linearGradientId}
        dataKeyRef="data-a"
        segmentBoundaryData={data.length ? [data[1]] : null}
        segmentColors={[schemeCategory10[1], schemeCategory10[2]]}
      />
      <SVGGrid tickCount={5} variable="dependent" />
      <SVGLineSeries
        dataKey="data-a"
        data={data}
        independentAccessor={independentAccessor}
        dependentAccessor={dependentAccessor}
        renderPath={(props) => (
          <SVGSwipedPath
            {...props}
            strokeWidth={4}
            stroke={createResourceUrlFromId(linearGradientId)}
            curve={curveCatmullRom}
          />
        )}
      />
      <SVGGlyphSeries
        dataKey="data-b"
        data={data}
        independentAccessor={independentAccessor}
        dependentAccessor={dependentAccessor}
        colorAccessor={(datum) => (datum.date <= data[1]?.date ? schemeCategory10[1] : schemeCategory10[2])}
        renderGlyph={SVGCircleGlyph}
        enableEvents={false}
        animate={false}
      />
      <SVGPointSeriesLabels dataKeyRef="data-a" formatter={dependentAxisTickLabelFormatter} />
      <SVGIndependentScaleA11ySeries<TimeValueDatum<number>>
        dataKeyOrKeysRef="data-a"
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${data[0].date}: ${data[0].value}`,
          'aria-roledescription': `Category ${category}`
        })}
      />
      <SVGAxis variable="independent" position="start" label="Date" tickLabelAlignment="angled" />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Quantity"
        tickCount={5}
        hideZero
        tickFormat={dependentAxisTickLabelFormatter}
        hideAxisPath
      />
      <SVGPointAnnotation datum={data[2]} dataKeyRef="data-a" />
      <SVGTooltip<TimeValueDatum<number>>
        snapTooltipToIndependentScale
        showIndependentScaleCrosshair
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
