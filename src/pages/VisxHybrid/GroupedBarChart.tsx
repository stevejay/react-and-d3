import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueListDatum, Margin } from '@/types';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarGroup } from '@/visx-hybrid/SVGBarGroup';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';
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
  margin: Margin;
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

// TODO I really think the scales and accessors should be labelled
// independent and dependent.
export function GroupedBarChart({ data, dataKeys, margin }: GroupedBarChartProps) {
  return (
    <SVGXYChart
      margin={margin}
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-label="Some title"
      dependentRangePadding={30}
      // hideTooltipDebounceMs={0}
    >
      {/* <XYChartColumnGrid className="text-slate-600" /> */}
      {/* <XYChartRowGrid className="text-red-600" tickCount={5} shapeRendering="crispEdges" /> */}
      {/* TODO Use refs within barSeries for the accessors? */}
      <SVGBarGroup padding={0}>
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
        autoMarginLabelPadding={10}
      />
      <SVGAxis
        variable="independent"
        position="start"
        label="Foobar Bottom"
        hideTicks
        tickLabelPadding={6}
        autoMarginLabelPadding={10}
      />
      <SVGAxis
        variable="dependent"
        position="start"
        label="Foobar Left"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
        autoMarginLabelPadding={36} // Does not take tick labels into account.
      />
      <SVGAxis
        variable="dependent"
        position="end"
        label="Foobar Right"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
        autoMarginLabelPadding={36} // Does not take tick labels into account.
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
