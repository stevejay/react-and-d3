import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { format } from 'd3-format';

import { CategoryValueDatum } from '@/types';
import { clippdTheme } from '@/utils/chartThemes';
import { InView } from '@/visx-hybrid/InView';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

const independentScaleConfig: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.4,
  paddingOuter: 0.2,
  round: true
} as const;

const dependentScaleConfig: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true,
  domain: [0, 200]
};

const tickValues = [0, 100, 200];

const dependentAxisTickLabelFormatter = format(',.1~f');

const data = [
  { category: 'OTT', value: 123 },
  { category: 'APP', value: 87 },
  { category: 'ARG', value: 122 },
  { category: 'PUTT', value: 112 }
] as const;

function colorAccessor(datum: CategoryValueDatum<string, number>) {
  switch (datum.category) {
    case 'OTT':
      return 'orange';
    case 'APP':
      return 'aqua';
    case 'ARG':
      return 'hotpink';
    case 'PUTT':
      return 'purple';
  }
}

export function ClippdBarChart() {
  return (
    <div className="relative w-full h-[384px] my-12">
      <InView>
        <SVGXYChart
          independentScale={independentScaleConfig}
          dependentScale={dependentScaleConfig}
          theme={clippdTheme}
        >
          <SVGGrid variable="dependent" tickValues={tickValues} />
          <SVGBarSeries
            dataKey="data-a"
            data={data}
            independentAccessor={(datum) => datum.category}
            dependentAccessor={(datum) => datum.value}
            renderBar={(props) => (
              <SVGBarWithLine
                {...props}
                lineProps={(datum) => ({
                  stroke: colorAccessor(datum),
                  strokeWidth: 4,
                  strokeLinecap: 'round'
                })}
              />
            )}
          />
          <SVGBarSeriesLabels
            dataKeyRef="data-a"
            formatter={dependentAxisTickLabelFormatter}
            position="outside"
          />
          <SVGAxis variable="independent" position="start" hideTicks hideAxisPath tickLabelPadding={12} />
          <SVGAxis
            variable="dependent"
            position="start"
            tickValues={tickValues}
            tickFormat={dependentAxisTickLabelFormatter}
            tickLabelPadding={16}
            hideTicks
            hideAxisPath
          />
        </SVGXYChart>
      </InView>
    </div>
  );
}
