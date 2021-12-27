import { ComponentMeta, Story } from '@storybook/react';
import type { AxisDomain, AxisScale } from 'd3';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from '@/Svg';
import { SvgAxis } from '@/SvgAxis';

export default {
  title: 'Chart/SvgAxis',
  argTypes: {
    orientation: {
      table: { disable: true }
    }
  },
  parameters: {
    controls: { expanded: false, hideNoControlsWarning: true }
  }
} as ComponentMeta<typeof SvgAxis>;

type ChartTemplateProps = {
  orientation: 'top' | 'bottom' | 'left' | 'right';
};

const LinearScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation }) => {
  const margin = 20;
  const scaleMargin = margin + 14;

  const margins = {
    top: orientation === 'top' ? scaleMargin : margin,
    bottom: orientation === 'bottom' ? scaleMargin : margin,
    left: orientation === 'left' ? scaleMargin : margin,
    right: orientation === 'right' ? scaleMargin : margin
  };

  const width = 400;
  const height = 400;
  const domain = [-10, 60];
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const scale = d3
    .scaleLinear()
    .domain(domain)
    .range([0, orientation === 'top' || orientation === 'bottom' ? chartWidth : chartHeight])
    .nice();

  const translateX =
    orientation === 'top' || orientation === 'bottom'
      ? margins.left
      : orientation === 'left'
      ? margins.left
      : margins.left + chartWidth;

  const translateY =
    orientation === 'left' || orientation === 'right'
      ? margins.top
      : orientation === 'bottom'
      ? margins.top + chartHeight
      : margins.top;

  return (
    <MotionConfig transition={{ duration: 0.25, ease: d3.easeCubicInOut }}>
      <Svg width={width} height={height} className="bg-slate-200 font-sans font-normal text-base select-none">
        <SvgAxis
          scale={scale as AxisScale<AxisDomain>}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickArguments={[5, 'X']}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
        />
      </Svg>
    </MotionConfig>
  );
};

export const LinearScaleLeft = LinearScaleChartTemplate.bind({});
LinearScaleLeft.args = {
  orientation: 'left'
};

export const LinearScaleRight = LinearScaleChartTemplate.bind({});
LinearScaleRight.args = {
  orientation: 'right'
};

export const LinearScaleTop = LinearScaleChartTemplate.bind({});
LinearScaleTop.args = {
  orientation: 'top'
};

export const LinearScaleBottom = LinearScaleChartTemplate.bind({});
LinearScaleBottom.args = {
  orientation: 'bottom'
};

const BandScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation }) => {
  const margin = 20;
  const xScaleMargin = margin + 40;
  const YScaleMargin = margin + 14;

  const margins = {
    top: orientation === 'top' ? YScaleMargin : margin,
    bottom: orientation === 'bottom' ? YScaleMargin : margin,
    left: orientation === 'left' ? xScaleMargin : margin,
    right: orientation === 'right' ? xScaleMargin : margin
  };

  const width = 400;
  const height = 400;
  const domain = ['Apple', 'Orange', 'Banana', 'Pear', 'Grape'];
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;
  const scale = d3
    .scaleBand()
    .domain(domain)
    .rangeRound([0, orientation === 'top' || orientation === 'bottom' ? chartWidth : chartHeight])
    .paddingOuter(0.5);

  const translateX =
    orientation === 'top' || orientation === 'bottom'
      ? margins.left
      : orientation === 'left'
      ? margins.left
      : margins.left + chartWidth;

  const translateY =
    orientation === 'left' || orientation === 'right'
      ? margins.top
      : orientation === 'bottom'
      ? margins.top + chartHeight
      : margins.top;

  return (
    <MotionConfig transition={{ duration: 0.25, ease: d3.easeCubicInOut }}>
      <Svg width={width} height={height} className="bg-slate-200 font-sans font-normal text-base select-none">
        <SvgAxis
          scale={scale as AxisScale<AxisDomain>}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
        />
      </Svg>
    </MotionConfig>
  );
};

export const BandScaleLeft = BandScaleChartTemplate.bind({});
BandScaleLeft.args = {
  orientation: 'left'
};

export const BandScaleRight = BandScaleChartTemplate.bind({});
BandScaleRight.args = {
  orientation: 'right'
};

export const BandScaleTop = BandScaleChartTemplate.bind({});
BandScaleTop.args = {
  orientation: 'top'
};

export const BandScaleBottom = BandScaleChartTemplate.bind({});
BandScaleBottom.args = {
  orientation: 'bottom'
};

const TimeScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation }) => {
  const margin = 20;
  const xScaleMargin = margin + 60;
  const YScaleMargin = margin + 14;

  const margins = {
    top: orientation === 'top' ? YScaleMargin : margin,
    bottom: orientation === 'bottom' ? YScaleMargin : margin,
    left: orientation === 'left' ? xScaleMargin : margin,
    right: orientation === 'right' ? xScaleMargin : margin
  };

  const width = 400;
  const height = 400;
  const domain = [new Date(2000, 0, 1), new Date(2000, 9, 1)];
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;
  const scale = d3
    .scaleTime()
    .domain(domain)
    .range([0, orientation === 'top' || orientation === 'bottom' ? chartWidth : chartHeight]);

  const translateX =
    orientation === 'top' || orientation === 'bottom'
      ? margins.left
      : orientation === 'left'
      ? margins.left
      : margins.left + chartWidth;

  const translateY =
    orientation === 'left' || orientation === 'right'
      ? margins.top
      : orientation === 'bottom'
      ? margins.top + chartHeight
      : margins.top;

  return (
    <MotionConfig transition={{ duration: 0.25, ease: d3.easeCubicInOut }}>
      <Svg width={width} height={height} className="bg-slate-200 font-sans font-normal text-base select-none">
        <SvgAxis
          scale={scale as AxisScale<AxisDomain>}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickArguments={[d3.timeMonth.every(3)]}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
        />
      </Svg>
    </MotionConfig>
  );
};

export const TimeScaleLeft = TimeScaleChartTemplate.bind({});
TimeScaleLeft.args = {
  orientation: 'left'
};

export const TimeScaleRight = TimeScaleChartTemplate.bind({});
TimeScaleRight.args = {
  orientation: 'right'
};

export const TimeScaleTop = TimeScaleChartTemplate.bind({});
TimeScaleTop.args = {
  orientation: 'top'
};

export const TimeScaleBottom = TimeScaleChartTemplate.bind({});
TimeScaleBottom.args = {
  orientation: 'bottom'
};

const PointScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation }) => {
  const margin = 20;
  const xScaleMargin = margin + 40;
  const YScaleMargin = margin + 14;

  const margins = {
    top: orientation === 'top' ? YScaleMargin : margin,
    bottom: orientation === 'bottom' ? YScaleMargin : margin,
    left: orientation === 'left' ? xScaleMargin : margin,
    right: orientation === 'right' ? xScaleMargin : margin
  };

  const width = 400;
  const height = 400;
  const domain = ['Red', 'Green', 'Black', 'Blue'];
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;
  const scale = d3
    .scalePoint()
    .domain(domain)
    .rangeRound([0, orientation === 'top' || orientation === 'bottom' ? chartWidth : chartHeight])
    .padding(0.5);

  const translateX =
    orientation === 'top' || orientation === 'bottom'
      ? margins.left
      : orientation === 'left'
      ? margins.left
      : margins.left + chartWidth;

  const translateY =
    orientation === 'left' || orientation === 'right'
      ? margins.top
      : orientation === 'bottom'
      ? margins.top + chartHeight
      : margins.top;

  return (
    <MotionConfig transition={{ duration: 0.25, ease: d3.easeCubicInOut }}>
      <Svg width={width} height={height} className="bg-slate-200 font-sans font-normal text-base select-none">
        <SvgAxis
          scale={scale as AxisScale<AxisDomain>}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
        />
      </Svg>
    </MotionConfig>
  );
};

export const PointScaleLeft = PointScaleChartTemplate.bind({});
PointScaleLeft.args = {
  orientation: 'left'
};

export const PointScaleRight = PointScaleChartTemplate.bind({});
PointScaleRight.args = {
  orientation: 'right'
};

export const PointScaleTop = PointScaleChartTemplate.bind({});
PointScaleTop.args = {
  orientation: 'top'
};

export const PointScaleBottom = PointScaleChartTemplate.bind({});
PointScaleBottom.args = {
  orientation: 'bottom'
};
