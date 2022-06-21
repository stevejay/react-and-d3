import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueListDatum, Margin } from '@/types';
import { SvgXYChartAxis } from '@/visx-next/Axis';
import { XYChartBarSeries } from '@/visx-next/BarSeries';
import { SvgXYChartBarStack } from '@/visx-next/BarStack';
import { XYChartRowGrid } from '@/visx-next/RowGrid';
import { SvgXYChart } from '@/visx-next/SvgXYChart';

export interface StackedBarChartProps {
  data: readonly CategoryValueListDatum<string, number>[];
  dataKeys: readonly string[];
  margin: Margin;
}

const xScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.9,
  paddingOuter: 0.2,
  round: true
} as const;

const yScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;

const colors = {
  one: schemeCategory10[0],
  two: schemeCategory10[1],
  three: schemeCategory10[2]
} as any; // TODO fix

function colorAccessor(_d: CategoryValueListDatum<string, number>, key: string) {
  console.log('>>key', key);
  return colors[key];
}

const springConfig = { duration: 350, easing: easeCubicInOut };

export function StackedBarChart({ data, dataKeys, margin }: StackedBarChartProps) {
  return (
    <SvgXYChart
      margin={margin}
      xScale={xScale}
      yScale={yScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-label="Some title"
      yRangePadding={30}
    >
      {/* <XYChartColumnGrid className="text-slate-600" /> */}
      <XYChartRowGrid className="text-red-600" tickCount={5} shapeRendering="crispEdges" />
      {/* TODO Use refs within barSeries for the accessors? */}
      <SvgXYChartBarStack stackOffset="none">
        {dataKeys.map((dataKey) => (
          <XYChartBarSeries
            key={dataKey}
            dataKey={dataKey}
            data={data}
            xAccessor={(d) => d.category}
            yAccessor={(d) => d.values[dataKey]}
            colorAccessor={colorAccessor}
            // barProps={{ shapeRendering: 'crispEdges' }}
            barProps={(datum: any) => ({
              shapeRendering: 'crispEdges',
              role: 'graphics-symbol',
              'aria-roledescription': '',
              'aria-label': 'Disaster' // `Category ${datum.category}: ${datum.values[dataKey]}`
            })}
            groupProps={{
              role: 'graphics-object',
              'aria-roledescription': 'series',
              'aria-label': `${dataKey}`
            }}
          />
        ))}
      </SvgXYChartBarStack>
      <SvgXYChartAxis
        orientation="top"
        label="Foobar Top"
        hideTicks
        tickLabelPadding={6}
        tickLabelProps={{
          className: 'fill-slate-400 font-sans',
          fontSize: 12,
          textAnchor: 'middle',
          verticalAnchor: 'end',
          angle: 0
        }}
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        tickLineProps={{ shapeRendering: 'crispEdges' }}
        domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelOffset={10}
      />
      <SvgXYChartAxis
        orientation="bottom"
        label="Foobar Bottom"
        hideTicks
        tickLabelPadding={6}
        tickLabelProps={{
          className: 'fill-slate-400 font-sans',
          fontSize: 12,
          textAnchor: 'middle',
          verticalAnchor: 'start',
          angle: 0
        }}
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        tickLineProps={{ shapeRendering: 'crispEdges' }}
        domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelOffset={10}
      />
      <SvgXYChartAxis
        orientation="left"
        label="Foobar Left"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
        tickLabelProps={{
          className: 'fill-slate-400 font-sans',
          fontSize: 12,
          textAnchor: 'end',
          verticalAnchor: 'middle',
          angle: -45
        }}
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        tickLineProps={{ shapeRendering: 'crispEdges' }}
        domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelOffset={36} // Does not take tick labels into account.
      />
      <SvgXYChartAxis
        orientation="right"
        label="Foobar Right"
        tickCount={5}
        hideZero
        tickLabelPadding={6}
        tickLabelProps={{
          className: 'fill-slate-400 font-sans',
          fontSize: 12,
          textAnchor: 'start',
          verticalAnchor: 'middle',
          angle: -45
        }}
        labelProps={{
          className: 'fill-slate-400 font-sans',
          textAnchor: 'middle',
          fontSize: 14
        }}
        tickLineProps={{ shapeRendering: 'crispEdges' }}
        domainPathProps={{ shapeRendering: 'crispEdges' }}
        labelOffset={36} // Does not take tick labels into account.
        // hideTicks
        // tickLength={0}
      />
    </SvgXYChart>
  );
}
