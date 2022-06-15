import { ComponentMeta, Story } from '@storybook/react';
import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { CategoryValueDatum, Margin, TickLabelOrientation } from '@/types';

import { SvgXYChartAxis } from '../Axis';
import { XYChartBarSeries } from '../BarSeries';
import { SvgXYChart } from '../SvgXYChart';

export default {
  title: 'VisxNext/XYChartAxis',
  argTypes: {
    orientation: {
      table: { disable: true }
    }
  },
  parameters: {
    controls: { expanded: false, hideNoControlsWarning: true }
  }
} as ComponentMeta<typeof SvgXYChartAxis>;

interface ChartTemplateProps {
  orientation: 'top' | 'bottom' | 'left' | 'right';
  tickLabelOrientation: TickLabelOrientation;
}

const data = [
  { category: 'A', value: 89.34 },
  { category: 'B', value: 83.56 },
  { category: 'C', value: 81.32 },
  { category: 'D', value: 102.974 },
  { category: 'E', value: 87.247 }
];

const xScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.9,
  paddingOuter: 0.2,
  round: true
} as const;

const yScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;

function xAccessor(d: CategoryValueDatum<string, number>) {
  return d.category;
}

function yAccessor(d: CategoryValueDatum<string, number>) {
  return d.value;
}

function colorAccessor(d: CategoryValueDatum<string, number>) {
  return schemeCategory10[0];
}

const margin: Margin = { left: 72, right: 40, top: 40, bottom: 64 };

const LinearScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation }) => {
  return (
    <SvgXYChart
      width={300}
      height={300}
      margin={margin}
      xScale={xScale}
      yScale={yScale}
      role="graphics-document"
      aria-label="Some title"
    >
      <XYChartBarSeries
        dataKey="data-a"
        data={data}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        colorAccessor={colorAccessor as (d: object) => string}
        barProps={{ shapeRendering: 'crispEdges' }}
      />
      <SvgXYChartAxis
        orientation="bottom"
        label="Foobar Bottom"
        hideTicks
        tickLabelProps={{
          className: 'fill-slate-400 font-sans',
          fontSize: 12,
          textAnchor: 'middle'
        }}
        labelClassName="fill-slate-400 font-sans"
        labelProps={{ textAnchor: 'middle', fontSize: 14 }}
        labelOffset={10}
        tickLabelPadding={6}
      />
    </SvgXYChart>
  );
};

export const LinearScaleLeft = LinearScaleChartTemplate.bind({});
LinearScaleLeft.args = {
  orientation: 'left',
  tickLabelOrientation: 'horizontal'
};
