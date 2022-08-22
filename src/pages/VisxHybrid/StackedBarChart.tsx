import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { capitalize, isNil } from 'lodash-es';

import type { CategoryValueListDatum } from '@/types';
import { SVGAreaAnnotation } from '@/visx-hybrid/SVGAreaAnnotation';
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

import { darkTheme } from './darkTheme';

export interface StackedBarChartProps {
  data: readonly CategoryValueListDatum<string, number>[];
  dataKeys: readonly string[];
}

const xScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.4,
  paddingOuter: 0.2,
  round: true
} as const;

const yScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;

function colorAccessor(_d: CategoryValueListDatum<string, number>, key: string) {
  switch (key) {
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

export function StackedBarChart({ data, dataKeys }: StackedBarChartProps) {
  return (
    <SVGXYChart
      independentScale={xScale}
      dependentScale={yScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-label="Some title"
      dependentRangePadding={30}
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
            colorAccessor={colorAccessor}
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
            hideOnOverflow={false}
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
      <SVGAxis variable="independent" position="end" label="Foobar Topy" tickLabelAlignment="angled" />
      <SVGAxis variable="independent" position="start" label="Foobar Bottomy" tickLabelAlignment="angled" />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Foobar Lefty"
        tickCount={5}
        hideZero
        tickLabelAlignment="angled"
      />
      <SVGAxis
        variable="dependent"
        position="end"
        label="Foobar Righty"
        tickCount={5}
        hideZero
        tickLabelAlignment="angled"
      />
      <SVGAreaAnnotation datum={data[1]} dataKeyRef={dataKeys[2]} />
      <SVGTooltip<CategoryValueListDatum<string, number>>
        snapTooltipToDatumX //={false}
        snapTooltipToDatumY={false}
        showVerticalCrosshair //={false}
        renderTooltip={({ tooltipData }) => (
          <div className="flex flex-col space-y-1 p-1">
            {dataKeys.map((dataKey) => {
              const datum = tooltipData?.datumByKey.get(dataKey)?.datum;
              return isNil(datum) ? null : (
                <p key={dataKey}>
                  <span style={{ color: colorAccessor(datum, dataKey) }}>{capitalize(dataKey)}</span>:{' '}
                  {datum.values[dataKey] ?? '--'}
                </p>
              );
            })}
          </div>
        )}
      />
    </SVGXYChart>
  );
}
