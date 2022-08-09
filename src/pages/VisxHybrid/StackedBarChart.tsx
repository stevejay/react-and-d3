import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { capitalize } from 'lodash-es';

import type { CategoryValueListDatum } from '@/types';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGA11ySeries } from '@/visx-hybrid/SVGA11ySeries';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarAnnotation } from '@/visx-hybrid/SVGBarAnnotation';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarStack } from '@/visx-hybrid/SVGBarStack';
import { SVGBarStackLabels } from '@/visx-hybrid/SVGBarStackLabels';
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
      <SVGBarStack<CategoryValueListDatum<string, number>> stackOrder="none">
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
      <SVGA11ySeries<CategoryValueListDatum<string, number>>
        dataKeyOrKeysRef={dataKeys}
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${category}: ${dataKeys
            .map((dataKey, index) => `${dataKey} is ${data[index].values[dataKey]}`)
            .join(', ')}`,
          'aria-roledescription': `Category ${category}`
        })}
      />
      <SVGAxis variable="independent" position="end" label="Foobar Topy" />
      <SVGAxis variable="independent" position="start" label="Foobar Bottomy" />
      <SVGAxis variable="dependent" position="start" label="Foobar Lefty" tickCount={5} hideZero />
      <SVGAxis variable="dependent" position="end" label="Foobar Righty" tickCount={5} hideZero />
      <SVGBarAnnotation datum={data[1]} dataKeyRef={dataKeys[2]} />
      <PopperTooltip<CategoryValueListDatum<string, number>>
        snapTooltipToDatumX //={false}
        snapTooltipToDatumY={false}
        showVerticalCrosshair //={false}
        renderTooltip={({ tooltipData }) => {
          const datumByKey = tooltipData?.datumByKey;
          if (!datumByKey) {
            return null;
          }
          return (
            <div className="flex flex-col space-y-1 p-1">
              {dataKeys.map((dataKey) => (
                <p key={dataKey}>
                  <span style={{ color: colorAccessor(datumByKey[dataKey].datum, dataKey) }}>
                    {capitalize(dataKey)}
                  </span>
                  : {datumByKey[dataKey].datum.values[dataKey]}
                </p>
              ))}
            </div>
          );
        }}
      />
    </SVGXYChart>
  );
}
