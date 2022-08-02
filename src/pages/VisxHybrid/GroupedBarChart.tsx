import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueListDatum } from '@/types';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarGroup } from '@/visx-hybrid/SVGBarGroup';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { darkTheme } from './darkTheme';
// import { SvgXYChartAxis } from '@/visx-next/Axis';
// import { XYChartBarGroup } from '@/visx-next/BarGroup';
// import { XYChartBarSeries } from '@/visx-next/BarSeries';
// import { PopperTooltip } from '@/visx-next/PopperTooltip';
// import { XYChartRowGrid } from '@/visx-next/RowGrid';
// import { SvgXYChart } from '@/visx-next/SvgXYChart';
// import Tooltip from '@/visx-next/Tooltip';

export interface GroupedBarChartProps {
  data: readonly CategoryValueListDatum<string, number>[];
  dataKeys: readonly string[];
}

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.2,
  paddingOuter: 0.4,
  round: true
} as const;

function colorAccessor(_d: CategoryValueListDatum<string, number>, key: string) {
  switch (key) {
    case 'one':
      return schemeCategory10[0]; // blue
    case 'two':
      return schemeCategory10[1]; // orange
    default:
      return schemeCategory10[2]; // green
  }
}

function keyAccessor(d: CategoryValueListDatum<string, number>) {
  return `${d.category}`;
}

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true
} as const;

const springConfig = { duration: 350, easing: easeCubicInOut };

export function GroupedBarChart({ data, dataKeys }: GroupedBarChartProps) {
  return (
    <SVGXYChart
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-label="Some title"
      dependentRangePadding={30}
      className="select-none"
      theme={darkTheme}
    >
      <SVGGrid tickCount={5} variable="dependent" />
      <SVGBarGroup padding={0} component={SVGBarWithLine}>
        {dataKeys.map((dataKey) => (
          <SVGBarSeries
            key={dataKey}
            dataKey={dataKey}
            data={data}
            keyAccessor={keyAccessor}
            independentAccessor={(datum) => datum.category}
            dependentAccessor={(datum) => datum.values[dataKey]}
            colorAccessor={colorAccessor}

            // barProps={{ shapeRendering: 'crispEdges' }}
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
      </SVGBarGroup>
      <SVGAxis
        variable="independent"
        position="end"
        label="Foobar Top"
        hideTicks
        tickLabelPadding={6}
        // autoMarginLabelPadding={10}
      />
      <SVGAxis
        variable="independent"
        position="start"
        label="Foobar Bottom"
        hideTicks
        tickLabelPadding={6}
        // autoMarginLabelPadding={10}
      />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Foobar Left"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
        // autoMarginLabelPadding={10}
      />
      <SVGAxis
        variable="dependent"
        position="end"
        label="Foobar Right"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
        // autoMarginLabelPadding={10}
      />
      {/* {false && (
        <Tooltip<CategoryValueListDatum<string, number>>
          snapTooltipToDatumX //={false}
          snapTooltipToDatumY={false}
          showVerticalCrosshair //={false}
          showSeriesGlyphs={false}
          renderTooltip={({ tooltipData }) => {
            const datum = tooltipData?.nearestDatum;
            if (!datum) {
              return null;
            }
            return (
              <div>
                <span style={{ color: colorAccessor(datum.datum, datum.key) }}>{datum.key}</span>{' '}
                {datum.datum.category}
                {': '}
                {datum.datum.values[datum.key]}
              </div>
            );
          }}
        />
      )}
      <PopperTooltip<CategoryValueListDatum<string, number>>
        snapTooltipToDatumX //={false}
        snapTooltipToDatumY={false}
        showVerticalCrosshair //={false}
        showDatumGlyph
        renderTooltip={({ tooltipData }) => {
          const datum = tooltipData?.nearestDatum;
          if (!datum) {
            return null;
          }
          return (
            <div>
              <span style={{ color: colorAccessor(datum.datum, datum.key) }}>{datum.key}</span>{' '}
              {datum.datum.category}
              {': '}
              {datum.datum.values[datum.key]}
            </div>
          );
        }}
      />  */}
    </SVGXYChart>
  );
}
