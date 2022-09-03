import type { LinearScaleConfig, UtcScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { curveCatmullRom } from 'd3-shape';
import { capitalize, isNil } from 'lodash-es';

import type { CategoryValueListDatum } from '@/types';
import { SVGAreaAnnotation } from '@/visx-hybrid/SVGAreaAnnotation';
import { SVGAreaSeries } from '@/visx-hybrid/SVGAreaSeries';
import { SVGAreaStack } from '@/visx-hybrid/SVGAreaStack';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarStackLabels } from '@/visx-hybrid/SVGBarStackLabels';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
import { SVGInterpolatedArea } from '@/visx-hybrid/SVGInterpolatedArea';
import { SVGInterpolatedPath } from '@/visx-hybrid/SVGInterpolatedPath';
import { SVGTooltip } from '@/visx-hybrid/SVGTooltip';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { defaultTheme } from './defaultTheme';

const independentScaleConfig: UtcScaleConfig<number> = {
  type: 'utc',
  nice: true,
  round: true,
  clamp: true
} as const;

const dependentScaleConfig: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true
} as const;

function colorAccessor(key: string) {
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

const dependentAxisTickLabelFormatter = format(',.1~f');

const springConfig = { duration: 350, easing: easeCubicInOut };

export interface StackedAreaChartProps {
  data: readonly CategoryValueListDatum<Date, number>[];
  dataKeys: readonly string[];
}

export function StackedAreaChart({ data, dataKeys }: StackedAreaChartProps) {
  return (
    <SVGXYChart
      independentScale={independentScaleConfig}
      dependentScale={dependentScaleConfig}
      springConfig={springConfig}
      role="graphics-document"
      aria-label="Some title"
      dependentRangePadding={30}
      theme={defaultTheme}
    >
      <SVGGrid tickCount={5} variable="dependent" />
      <SVGAreaStack<CategoryValueListDatum<Date, number>>
      // stackOffset="none"
      >
        {dataKeys.map((dataKey) => (
          <SVGAreaSeries
            key={dataKey}
            dataKey={dataKey}
            data={data}
            independentAccessor={(datum) => datum.category}
            dependentAccessor={(datum) => datum.values[dataKey]}
            renderArea={(props) => (
              <SVGInterpolatedArea
                {...props}
                curve={curveCatmullRom}
                opacity={0.4}
                // fill={schemeCategory10[1]}
                // fill={createResourceUrlFromId(patternId)}
              />
            )}
            renderPath={(props) => (
              <SVGInterpolatedPath
                {...props}
                strokeWidth={4}
                curve={curveCatmullRom}
                // color={schemeCategory10[1]}
              />
            )}
          />
        ))}
      </SVGAreaStack>
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
      <SVGIndependentScaleA11ySeries<CategoryValueListDatum<Date, number>>
        dataKeyOrKeysRef={dataKeys}
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${category}: ${dataKeys
            .map((dataKey, index) => `${dataKey} is ${data[index].values[dataKey]}`)
            .join(', ')}`,
          'aria-roledescription': `Category ${category}`
        })}
      />
      <SVGAxis variable="independent" position="start" label="Foobar Bottomy" tickLabelAlignment="angled" />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Foobar Lefty"
        tickCount={5}
        // hideZero
        tickLabelAlignment="angled"
      />
      <SVGAreaAnnotation datum={data[1]} dataKeyRef={dataKeys[2]} />
      <SVGTooltip<CategoryValueListDatum<Date, number>>
        snapTooltipToIndependentScale
        showIndependentScaleCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData }) => (
          <div className="flex flex-col space-y-1 p-1">
            {dataKeys.map((dataKey) => {
              const datum = tooltipData?.datumByKey.get(dataKey)?.datum;
              return isNil(datum) ? null : (
                <p key={dataKey}>
                  <span style={{ color: colorAccessor(dataKey) }}>{capitalize(dataKey)}</span>:{' '}
                  {datum.values[dataKey]}
                </p>
              );
            })}
          </div>
        )}
      />
    </SVGXYChart>
  );
}
