import { useId } from 'react';
import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { isNil } from 'lodash-es';

import { ChartTitle } from '@/components/ChartTitle';
import type { CategoryValueListDatum } from '@/types';
import { darkTheme } from '@/utils/chartThemes';
import { InView } from '@/visx-hybrid/InView';
import { Legend } from '@/visx-hybrid/Legend';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBar } from '@/visx-hybrid/SVGBar';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarStack } from '@/visx-hybrid/SVGBarStack';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
import { SVGTooltip, TooltipRenderParams } from '@/visx-hybrid/SVGTooltip';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

const data = [
  { category: '1', values: { a: 20, b: 0, c: 0 } },
  { category: '2', values: { a: 84, b: 20, c: 40 } },
  { category: '3', values: { a: 81, b: 50, c: 60 } },
  { category: '4', values: { a: 103, b: 10, c: 0 } },
  { category: '5', values: { a: 87, b: 0, c: 40 } }
] as const;

const legend = {
  a: { label: 'Product 1', color: schemeCategory10[0] },
  b: { label: 'Product 2', color: schemeCategory10[1] },
  c: { label: 'Product 3', color: schemeCategory10[2] }
} as const;

const dataKeys = Object.keys(legend) as (keyof typeof legend)[];

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
  clamp: true
} as const;

const dependentAxisTickLabelFormatter = format(',.1~f');

function Tooltip({ tooltipData }: TooltipRenderParams<CategoryValueListDatum<string, number>>) {
  return (
    <div className="flex flex-col space-y-1 p-1">
      {dataKeys.map((dataKey) => {
        const datum = tooltipData?.datumByKey.get(dataKey)?.datum;
        return isNil(datum) ? null : (
          <p key={dataKey} className="flex items-center gap-2">
            <span style={{ backgroundColor: legend[dataKey].color }} className="block w-3 h-3 rounded-sm" />
            <span className="text-slate-300">{legend[dataKey].label}:</span>{' '}
            {dependentAxisTickLabelFormatter(datum.values[dataKey])}
          </p>
        );
      })}
    </div>
  );
}

export function StackedBarChart() {
  const labelId = useId();
  return (
    <div className="my-12">
      <Legend config={legend} />
      <div className="relative w-full h-[384px]">
        <InView>
          <SVGXYChart
            independentScale={independentScaleConfig}
            dependentScale={dependentScaleConfig}
            role="graphics-document"
            aria-roledescription="Stacked bar chart"
            aria-labelledby={labelId}
            theme={darkTheme}
          >
            <SVGGrid tickCount={5} variable="dependent" />
            <SVGBarStack<CategoryValueListDatum<string, number>> stackOrder="none" renderBar={SVGBar}>
              {dataKeys.map((dataKey) => (
                <SVGBarSeries
                  key={dataKey}
                  dataKey={dataKey}
                  data={data}
                  independentAccessor={(datum) => datum.category}
                  dependentAccessor={(datum) => datum.values[dataKey]}
                  colorAccessor={() => legend[dataKey].color}
                  renderBar={SVGBar}
                />
              ))}
            </SVGBarStack>
            <SVGIndependentScaleA11ySeries<CategoryValueListDatum<string, number>>
              dataKeyOrKeysRef={dataKeys}
              categoryA11yProps={(category, data) => ({
                'aria-label': `Using Strategy ${category}: ${dataKeys
                  .map(
                    (dataKey, index) =>
                      `${legend[dataKey].label} sold ${dependentAxisTickLabelFormatter(
                        data[index].values[dataKey]
                      )} units`
                  )
                  .join(', ')}`,
                'aria-roledescription': `Strategy ${category}`
              })}
            />
            <SVGAxis variable="independent" position="start" label="Sales strategy" tickLength={0} />
            <SVGAxis
              variable="dependent"
              position="start"
              label="Sales volume (units)"
              tickCount={5}
              tickFormat={dependentAxisTickLabelFormatter}
            />
            <SVGTooltip<CategoryValueListDatum<string, number>>
              snapTooltipToIndependentScale
              showIndependentScaleCrosshair
              renderTooltip={Tooltip}
            />
          </SVGXYChart>
        </InView>
      </div>
      <ChartTitle className="italic mt-4 mb-0 text-center" id={labelId}>
        Figure 1: Comparing sales strategies
      </ChartTitle>
    </div>
  );
}
