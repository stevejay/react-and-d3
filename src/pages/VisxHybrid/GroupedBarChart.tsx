import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';

import type { CategoryValueListDatum } from '@/types';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGA11ySeries } from '@/visx-hybrid/SVGA11ySeries';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarAnnotation } from '@/visx-hybrid/SVGBarAnnotation';
import { SVGBarGroup } from '@/visx-hybrid/SVGBarGroup';
import { SVGBarGroupLabels } from '@/visx-hybrid/SVGBarGroupLabels';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { darkTheme } from './darkTheme';

export interface GroupedBarChartProps {
  data: readonly CategoryValueListDatum<string, number>[];
  dataKeys: readonly string[];
}

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.2,
  paddingOuter: 0.4,
  // paddingOuter: 0,
  // paddingInner: 0
  round: true
} as const;

function colorAccessor(_d: CategoryValueListDatum<string, number>, key: string) {
  switch (key) {
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
      className="select-none"
      theme={darkTheme}
      // horizontal
    >
      <SVGGrid tickCount={5} variable="dependent" />
      <SVGBarGroup padding={0} component={SVGBarWithLine}>
        {dataKeys.map((dataKey) => (
          <SVGBarSeries
            key={dataKey}
            dataKey={dataKey}
            data={data}
            independentAccessor={(datum) => datum.category}
            dependentAccessor={(datum) => datum.values[dataKey]}
            colorAccessor={colorAccessor}
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
      <SVGA11ySeries<CategoryValueListDatum<string, number>>
        dataKeyOrKeysRef={dataKeys}
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${data[0]?.category}: ${dataKeys
            .map((dataKey) => `${dataKey} is ${data[0]?.values[dataKey]}`)
            .join(', ')}`,
          'aria-roledescription': `Category ${category}`
        })}
      />
      <SVGBarAnnotation datum={data[2]} dataKeyRef="three" />
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
      <PopperTooltip<CategoryValueListDatum<string, number>>
        snapTooltipToDatumX //={false}
        snapTooltipToDatumY={false}
        showVerticalCrosshair //={false}
        showDatumGlyph
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum;
          if (!datum) {
            return null;
          }
          return (
            <div>
              <span style={{ color: colorAccessor(datum.datum, datum.key) }}>{datum.key}</span>
              {': '}
              {datum.datum.values[datum.key]}
            </div>
          );
        }}
      />
    </SVGXYChart>
  );
}
