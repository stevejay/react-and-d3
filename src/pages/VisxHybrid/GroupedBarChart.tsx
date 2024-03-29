import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';

import type { CategoryValueListDatum } from '@/types';
import { SVGAreaAnnotation } from '@/visx-hybrid/SVGAreaAnnotation';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarGroup } from '@/visx-hybrid/SVGBarGroup';
import { SVGBarGroupLabels } from '@/visx-hybrid/SVGBarGroupLabels';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
import { SVGTooltip } from '@/visx-hybrid/SVGTooltip';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { defaultTheme } from './defaultTheme';

export interface GroupedBarChartProps {
  data: readonly CategoryValueListDatum<string, number>[];
  dataKeys: readonly string[];
}

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.2,
  paddingOuter: 0.4,
  round: true
} as const;

function colorAccessor(dataKey: string) {
  switch (dataKey) {
    case 'one':
      return schemeCategory10[0]; // blue
    case 'two':
      return schemeCategory10[1]; // orange
    default:
      return schemeCategory10[2]; // green
  }
}

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true
} as const;

const springConfig = { duration: 350, easing: easeCubicInOut };

const dependentAxisTickLabelFormatter = format(',.1~f');

export function GroupedBarChart({ data, dataKeys }: GroupedBarChartProps) {
  return (
    <SVGXYChart
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Grouped bar chart"
      aria-label="Some title"
      dependentRangePadding={30}
      theme={defaultTheme}
      // horizontal
    >
      <SVGGrid tickCount={5} variable="dependent" />
      <SVGBarGroup padding={0} renderBar={SVGBarWithLine}>
        {dataKeys.map((dataKey) => (
          <SVGBarSeries
            key={dataKey}
            dataKey={dataKey}
            data={data}
            independentAccessor={(datum) => datum.category}
            dependentAccessor={(datum) => datum.values[dataKey]}
            colorAccessor={() => colorAccessor(dataKey)}
            renderBar={SVGBarWithLine}
          />
        ))}
      </SVGBarGroup>
      <SVGBarGroupLabels>
        {dataKeys.map((dataKey) => (
          <SVGBarSeriesLabels
            key={dataKey}
            dataKeyRef={dataKey}
            formatter={dependentAxisTickLabelFormatter}
          />
        ))}
      </SVGBarGroupLabels>
      <SVGIndependentScaleA11ySeries<CategoryValueListDatum<string, number>>
        dataKeyOrKeysRef={dataKeys}
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${data[0]?.category}: ${dataKeys
            .map((dataKey) => `${dataKey} is ${data[0]?.values[dataKey]}`)
            .join(', ')}`,
          'aria-roledescription': `Category ${category}`
        })}
      />
      <SVGAreaAnnotation datum={data[2]} dataKeyRef="three" />
      <SVGAxis variable="independent" position="end" label="Foobar Top" hideTicks tickLabelPadding={6} />
      <SVGAxis variable="independent" position="start" label="Foobar Bottom" hideTicks tickLabelPadding={6} />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Foobar Left"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
      />
      <SVGAxis
        variable="dependent"
        position="end"
        label="Foobar Right"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
      />
      <SVGTooltip<CategoryValueListDatum<string, number>>
        snapTooltipToIndependentScale
        showIndependentScaleCrosshair
        showDatumGlyph
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum;
          if (!datum) {
            return null;
          }
          return (
            <div>
              <span style={{ color: colorAccessor(datum.dataKey) }}>{datum.dataKey}</span>
              {': '}
              {datum.datum.values[datum.dataKey] ?? '--'}
            </div>
          );
        }}
      />
    </SVGXYChart>
  );
}
