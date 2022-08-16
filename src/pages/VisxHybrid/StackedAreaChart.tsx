import type { LinearScaleConfig, UtcScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
// import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { curveCatmullRom } from 'd3-shape';
import { capitalize, isNil } from 'lodash-es';

import type { CategoryValueListDatum } from '@/types';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGAreaAnnotation } from '@/visx-hybrid/SVGAreaAnnotation';
import { SVGAreaSeries } from '@/visx-hybrid/SVGAreaSeries';
import { SVGAreaStack } from '@/visx-hybrid/SVGAreaStack';
// import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
import { SVGInterpolatedArea } from '@/visx-hybrid/SVGInterpolatedArea';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { darkTheme } from './darkTheme';

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

function colorAccessor(_d: CategoryValueListDatum<Date, number>, key: string) {
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

// const dependentAxisTickLabelFormatter = format(',.1~f');

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
      theme={darkTheme}
    >
      <SVGGrid tickCount={5} variable="dependent" />
      <SVGAreaStack<CategoryValueListDatum<Date, number>>
      //  stackOrder="none"
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
                // opacity={0.4}
                // fill={schemeCategory10[1]}
                // fill={createResourceUrlFromId(patternId)}
              />
            )}
          />
        ))}
      </SVGAreaStack>
      <SVGIndependentScaleA11ySeries<CategoryValueListDatum<Date, number>>
        dataKeyOrKeysRef={dataKeys}
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${category}: ${dataKeys
            .map((dataKey, index) => `${dataKey} is ${data[index].values[dataKey]}`)
            .join(', ')}`,
          'aria-roledescription': `Category ${category}`
        })}
      />
      {/* <SVGBarStackLabels>
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
      </SVGBarStackLabels> */}
      {/* <SVGIndependentScaleA11ySeries<CategoryValueListDatum<Date, number>>
        dataKeyOrKeysRef={dataKeys}
        categoryA11yProps={(category, data) => ({
          'aria-label': `Category ${category}: ${dataKeys
            .map((dataKey, index) => `${dataKey} is ${data[index].values[dataKey]}`)
            .join(', ')}`,
          'aria-roledescription': `Category ${category}`
        })}
      /> */}
      {/* <SVGAxis variable="independent" position="end" label="Foobar Topy" tickLabelAlignment="angled" /> */}
      <SVGAxis variable="independent" position="start" label="Foobar Bottomy" tickLabelAlignment="angled" />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Foobar Lefty"
        tickCount={5}
        // hideZero
        tickLabelAlignment="angled"
      />
      {/* <SVGAxis
        variable="dependent"
        position="end"
        label="Foobar Righty"
        tickCount={5}
        hideZero
        tickLabelAlignment="angled"
      /> */}
      <SVGAreaAnnotation datum={data[1]} dataKeyRef={dataKeys[2]} />
      <PopperTooltip<CategoryValueListDatum<Date, number>>
        snapTooltipToDatumX //={false}
        snapTooltipToDatumY={false}
        showVerticalCrosshair //={false}
        // showDatumGlyph
        renderTooltip={({ tooltipData }) => (
          <div className="flex flex-col space-y-1 p-1">
            {dataKeys.map((dataKey) => {
              const datum = tooltipData?.datumByKey.get(dataKey)?.datum;
              return isNil(datum) ? null : (
                <p key={dataKey}>
                  <span style={{ color: colorAccessor(datum, dataKey) }}>{capitalize(dataKey)}</span>:{' '}
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
