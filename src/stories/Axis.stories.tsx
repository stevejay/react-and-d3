import { ComponentMeta, Story } from '@storybook/react';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { Axis } from '@/Axis';
import { SvgSvg } from '@/SvgSvg';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Chart/Axis',
  argTypes: {
    orientation: {
      table: { disable: true }
    }
  },
  parameters: {
    controls: { expanded: false, hideNoControlsWarning: true }
  }
} as ComponentMeta<typeof Axis>;

type TemplateProps = {
  orientation: 'top' | 'bottom' | 'left' | 'right';
};

const LinearScaleTemplate: Story<TemplateProps> = ({ orientation }) => {
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

  console.log(orientation, margins, chartWidth);
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
      <SvgSvg width={width} height={height} className="bg-slate-200 font-sans font-normal text-base">
        <Axis
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickArguments={[5, 'X']}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
        />
      </SvgSvg>
    </MotionConfig>
  );
};

export const LeftLinearScale = LinearScaleTemplate.bind({});
LeftLinearScale.args = {
  orientation: 'left'
};

export const RightLinearScale = LinearScaleTemplate.bind({});
RightLinearScale.args = {
  orientation: 'right'
};

export const TopLinearScale = LinearScaleTemplate.bind({});
TopLinearScale.args = {
  orientation: 'top'
};

export const BottomLinearScale = LinearScaleTemplate.bind({});
BottomLinearScale.args = {
  orientation: 'bottom'
};

const BandScaleTemplate: Story<TemplateProps> = ({ orientation }) => {
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
      <SvgSvg width={width} height={height} className="bg-slate-200 font-sans font-normal text-base">
        <Axis
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
        />
      </SvgSvg>
    </MotionConfig>
  );
};

export const LeftBandScale = BandScaleTemplate.bind({});
LeftBandScale.args = {
  orientation: 'left'
};

export const RightBandScale = BandScaleTemplate.bind({});
RightBandScale.args = {
  orientation: 'right'
};

export const TopBandScale = BandScaleTemplate.bind({});
TopBandScale.args = {
  orientation: 'top'
};

export const BottomBandScale = BandScaleTemplate.bind({});
BottomBandScale.args = {
  orientation: 'bottom'
};

const TimeScaleTemplate: Story<TemplateProps> = ({ orientation }) => {
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
      <SvgSvg width={width} height={height} className="bg-slate-200 font-sans font-normal text-base">
        <Axis
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickArguments={[d3.timeMonth.every(3)]}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
        />
      </SvgSvg>
    </MotionConfig>
  );
};

export const LeftTimeScale = TimeScaleTemplate.bind({});
LeftTimeScale.args = {
  orientation: 'left'
};

export const RightTimeScale = TimeScaleTemplate.bind({});
RightTimeScale.args = {
  orientation: 'right'
};

export const TopTimeScale = TimeScaleTemplate.bind({});
TopTimeScale.args = {
  orientation: 'top'
};

export const BottomTimeScale = TimeScaleTemplate.bind({});
BottomTimeScale.args = {
  orientation: 'bottom'
};

const PointScaleTemplate: Story<TemplateProps> = ({ orientation }) => {
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
      <SvgSvg width={width} height={height} className="bg-slate-200 font-sans font-normal text-base">
        <Axis
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
        />
      </SvgSvg>
    </MotionConfig>
  );
};

export const LeftPointScale = PointScaleTemplate.bind({});
LeftPointScale.args = {
  orientation: 'left'
};

export const RightPointScale = PointScaleTemplate.bind({});
RightPointScale.args = {
  orientation: 'right'
};

export const TopPointScale = PointScaleTemplate.bind({});
TopPointScale.args = {
  orientation: 'top'
};

export const BottomPointScale = PointScaleTemplate.bind({});
BottomPointScale.args = {
  orientation: 'bottom'
};
