import { useId } from 'react';
import { PatternLines } from '@visx/pattern';
import type { LinearScaleConfig, UtcScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { curveCatmullRom } from 'd3-shape';
import { timeFormat } from 'd3-time-format';

import type { TimeValueDatum } from '@/types';
import { createResourceUrlFromId } from '@/visx-hybrid/createResourceUrlFromId';
import { SVGAreaSeries } from '@/visx-hybrid/SVGAreaSeries';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
import { SVGInterpolatedArea } from '@/visx-hybrid/SVGInterpolatedArea';
import { SVGInterpolatedPath } from '@/visx-hybrid/SVGInterpolatedPath';
import { SVGPointAnnotation } from '@/visx-hybrid/SVGPointAnnotation';
import { SVGPointSeriesLabels } from '@/visx-hybrid/SVGPointSeriesLabels';
import { SVGTooltip } from '@/visx-hybrid/SVGTooltip';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { darkTheme } from './darkTheme';

export interface AreaChartProps {
  data: TimeValueDatum<number>[];
}

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
  clamp: true,
  zero: true
} as const;

function independentAccessor(d: TimeValueDatum<number>) {
  return d.date;
}

function dependentAccessor(d: TimeValueDatum<number>) {
  return d.value;
}

const independentDatumLabelFormatter = timeFormat('%e %B %Y');

const dependentAxisTickLabelFormatter = format(',.1~f');

const springConfig = { duration: 350, easing: easeCubicInOut };

export function AreaChart({ data }: AreaChartProps) {
  const patternId = useId();
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
      theme={darkTheme}
      // horizontal
    >
      <PatternLines
        id={patternId}
        width={16}
        height={16}
        orientation={['diagonal']}
        stroke={schemeCategory10[1]}
        strokeWidth={2}
      />
      <SVGGrid tickCount={5} variable="dependent" />
      <SVGAreaSeries
        dataKey="data-a"
        data={data}
        independentAccessor={independentAccessor}
        dependentAccessor={dependentAccessor}
        renderArea={(props) => (
          <SVGInterpolatedArea
            {...props}
            curve={curveCatmullRom}
            opacity={0.4}
            // fill={schemeCategory10[1]}
            fill={createResourceUrlFromId(patternId)}
          />
        )}
        renderPath={(props) => (
          <SVGInterpolatedPath
            {...props}
            strokeWidth={4}
            curve={curveCatmullRom}
            color={schemeCategory10[1]}
          />
        )}
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
        // hideZero
        tickFormat={dependentAxisTickLabelFormatter}
        hideAxisPath
      />
      <SVGPointAnnotation datum={data[2]} dataKeyRef="data-a" />
      <SVGTooltip<TimeValueDatum<number>>
        snapTooltipToDatumX
        showVerticalCrosshair
        showDatumGlyph
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum;
          return datum ? (
            <div>
              <span className="font-bold">{independentDatumLabelFormatter(datum.datum?.date)}</span>:{' '}
              {datum.datum?.value ?? '--'}
            </div>
          ) : null;
        }}
      />
    </SVGXYChart>
  );
}
