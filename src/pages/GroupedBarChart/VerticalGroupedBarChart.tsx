import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { capitalize } from 'lodash-es';

import type { CategoryValueListDatum } from '@/types';
import { darkTheme } from '@/utils/chartThemes';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarGroup } from '@/visx-hybrid/SVGBarGroup';
import { SVGBarGroupLabels } from '@/visx-hybrid/SVGBarGroupLabels';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGTooltip } from '@/visx-hybrid/SVGTooltip';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

export interface VerticalGroupedBarChartProps {
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

export function VerticalGroupedBarChart({ data, dataKeys }: VerticalGroupedBarChartProps) {
  return (
    <SVGXYChart
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      theme={darkTheme}
      dependentRangePadding={30}
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
            position="outside"
          />
        ))}
      </SVGBarGroupLabels>
      <SVGAxis
        variable="independent"
        position="start"
        label="Independent Axis"
        hideTicks
        tickLabelPadding={6}
      />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Dependent Axis"
        tickCount={5}
        tickLabelPadding={6}
      />
      <SVGTooltip<CategoryValueListDatum<string, number>>
        snapTooltipToIndependentScale
        showIndependentScaleCrosshair
        showDatumGlyph
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum;
          return datum ? (
            <p className="flex items-center gap-2">
              <span
                style={{ backgroundColor: colorAccessor(datum.dataKey) }}
                className="block w-3 h-3 rounded-sm"
              />
              <span className="text-slate-300">{capitalize(datum.dataKey)}:</span>{' '}
              {dependentAxisTickLabelFormatter(datum.datum.values[datum.dataKey]) ?? '--'}
            </p>
          ) : null;
        }}
      />
    </SVGXYChart>
  );
}
