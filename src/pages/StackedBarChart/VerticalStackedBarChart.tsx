import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { capitalize, isNil } from 'lodash-es';

import type { CategoryValueListDatum } from '@/types';
import { darkTheme } from '@/utils/chartThemes';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBar } from '@/visx-hybrid/SVGBar';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarStack } from '@/visx-hybrid/SVGBarStack';
import { SVGBarStackLabels } from '@/visx-hybrid/SVGBarStackLabels';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
import { SVGTooltip } from '@/visx-hybrid/SVGTooltip';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

export interface VerticalStackedBarChartProps {
  data: readonly CategoryValueListDatum<string, number>[];
  dataKeys: readonly string[];
}

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.4,
  paddingOuter: 0.2,
  round: true
} as const;

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true
} as const;

function colorAccessor(dataKey: string) {
  switch (dataKey) {
    case 'one':
      return schemeCategory10[0];
    case 'two':
      return schemeCategory10[1];
    case 'three':
      return schemeCategory10[2];
    default:
      return 'gray';
  }
}

const springConfig = { duration: 350, easing: easeCubicInOut };

const dependentAxisTickLabelFormatter = format(',.1~f');

export function VerticalStackedBarChart({ data, dataKeys }: VerticalStackedBarChartProps) {
  return (
    <SVGXYChart
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-label="Some title"
      dependentRangePadding={30}
      theme={darkTheme}
    >
      <SVGGrid
        tickCount={5}
        variable="dependent"
        lineProps={({ value }) => ({
          strokeDasharray: value === 0 ? 'none' : undefined,
          className: value === 0 ? 'text-slate-200' : undefined,
          strokeWidth: value === 0 ? 2 : undefined
        })}
      />
      <SVGBarStack<CategoryValueListDatum<string, number>> stackOrder="none" renderBar={SVGBar}>
        {dataKeys.map((dataKey) => (
          <SVGBarSeries
            key={dataKey}
            dataKey={dataKey}
            data={data}
            independentAccessor={(datum) => datum.category}
            dependentAccessor={(datum) => datum.values[dataKey]}
            colorAccessor={() => colorAccessor(dataKey)}
            renderBar={SVGBar}
          />
        ))}
      </SVGBarStack>
      <SVGBarStackLabels>
        {dataKeys.map((dataKey) => (
          <SVGBarSeriesLabels
            key={dataKey}
            dataKeyRef={dataKey}
            formatter={dependentAxisTickLabelFormatter}
            position="inside-centered"
            positionOutsideOnOverflow={false}
            hideOnOverflow
            padding={0}
          />
        ))}
      </SVGBarStackLabels>
      <SVGIndependentScaleA11ySeries<CategoryValueListDatum<string, number>>
        dataKeyOrKeysRef={dataKeys}
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${category}: ${dataKeys
            .map((dataKey, index) => `${dataKey} is ${data[index].values[dataKey]}`)
            .join(', ')}`,
          'aria-roledescription': `Category ${category}`
        })}
      />
      <SVGAxis variable="independent" position="start" label="Independent Axis" />
      <SVGAxis variable="dependent" position="start" label="Dependent Axis" tickCount={5} />
      <SVGTooltip<CategoryValueListDatum<string, number>>
        snapTooltipToIndependentScale
        showIndependentScaleCrosshair
        renderTooltip={({ tooltipData }) => (
          <div className="flex flex-col space-y-1 p-1">
            {dataKeys.map((dataKey) => {
              const datum = tooltipData?.datumByKey.get(dataKey)?.datum;
              return isNil(datum) ? null : (
                <p key={dataKey} className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: colorAccessor(dataKey) }}
                    className="block w-3 h-3 rounded-sm"
                  />
                  <span className="text-slate-300">{capitalize(dataKey)}:</span>{' '}
                  {dependentAxisTickLabelFormatter(datum.values[dataKey])}
                </p>
              );
            })}
          </div>
        )}
      />
    </SVGXYChart>
  );
}
