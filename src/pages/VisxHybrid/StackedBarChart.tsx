import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueListDatum, Margin } from '@/types';
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
  margin: Margin;
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

function keyAccessor(d: CategoryValueListDatum<string, number>) {
  return `${d.category}`;
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
      <SVGBarStack stackOrder="none">
        {dataKeys.map((dataKey) => (
          <SVGBarSeries
            key={dataKey}
            dataKey={dataKey}
            data={data}
            keyAccessor={keyAccessor}
            independentAccessor={(d) => d.category}
            dependentAccessor={(d) => d.values[dataKey]}
            colorAccessor={colorAccessor}
            // barProps={(datum) => ({
            //   shapeRendering: 'crispEdges',
            //   role: 'graphics-symbol',
            //   'aria-roledescription': '',
            //   'aria-label': `Category ${(datum as CategoryValueListDatum<string, number>).category}: ${
            //     (datum as CategoryValueListDatum<string, number>).values[dataKey]
            //   }`
            // })}
            // groupProps={{
            //   role: 'graphics-object',
            //   'aria-roledescription': 'series',
            //   'aria-label': `${dataKey}`
            // }}
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
