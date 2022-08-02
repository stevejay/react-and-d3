import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueListDatum } from '@/types';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarStack } from '@/visx-hybrid/SVGBarStack';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
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

function keyAccessor(datum: CategoryValueListDatum<string, number>) {
  return `${datum.category}`;
}

const springConfig = { duration: 350, easing: easeCubicInOut };

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
      <SVGBarStack<CategoryValueListDatum<string, number>>
        stackOrder="none"
        categoryA11yProps={(category: string, data: readonly CategoryValueListDatum<string, number>[]) => {
          return {
            'aria-label': `Category ${category}: ${dataKeys
              .map((dataKey, index) => `${dataKey} is ${data[index].values[dataKey]}`)
              .join(', ')}`,
            'aria-roledescription': `Category ${category}`
          };
        }}
      >
        {dataKeys.map((dataKey) => (
          <SVGBarSeries
            key={dataKey}
            dataKey={dataKey}
            data={data}
            keyAccessor={keyAccessor}
            independentAccessor={(datum) => datum.category}
            dependentAccessor={(datum) => datum.values[dataKey]}
            colorAccessor={colorAccessor}
          />
        ))}
      </SVGBarStack>
      <SVGAxis variable="independent" position="end" label="Foobar Topy" />
      <SVGAxis variable="independent" position="start" label="Foobar Bottomy" />
      <SVGAxis variable="dependent" position="start" label="Foobar Lefty" tickCount={5} hideZero />
      <SVGAxis variable="dependent" position="end" label="Foobar Righty" tickCount={5} hideZero />
      <PopperTooltip<CategoryValueListDatum<string, number>>
        snapTooltipToDatumX //={false}
        snapTooltipToDatumY={false}
        showVerticalCrosshair //={false}
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum;
          if (!datum) {
            return null;
          }
          return (
            <div className="flex flex-col space-y-1 p-1">
              {Object.keys(datum.datum.values).map((key) => {
                return (
                  <p key={key}>
                    <span style={{ color: colorAccessor(datum.datum, key) }}>{key}</span>:{' '}
                    {datum.datum.values[key]}
                  </p>
                );
              })}
            </div>
          );
        }}
      />
    </SVGXYChart>
  );
}
