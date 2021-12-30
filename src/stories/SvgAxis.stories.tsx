import { ComponentMeta, Story } from '@storybook/react';
import type { AxisScale } from 'd3';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from '@/Svg';
import { SvgAxis } from '@/SvgAxis';
import type { AxisLabelOrientation } from '@/types';

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
  labelOrientation: AxisLabelOrientation;
};

const LinearScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation, labelOrientation }) => {
  const margin = 40;
  const textWidthMargin = margin + (labelOrientation === 'angled' ? 28 : 34);
  const textHeightMargin = margin + (labelOrientation === 'angled' ? 28 : 14);

  const margins = {
    top:
      orientation === 'top' ? (labelOrientation === 'vertical' ? textWidthMargin : textHeightMargin) : margin,
    bottom:
      orientation === 'bottom'
        ? labelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    left:
      orientation === 'left'
        ? labelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin,
    right:
      orientation === 'right'
        ? labelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin
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
    .nice() as AxisScale<number>;

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
      <Svg width={width} height={height} className="font-sans text-base font-normal select-none bg-slate-200">
        <SvgAxis
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickArguments={[5, 'X']}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
          labelOrientation={labelOrientation}
          className="text-[10px]"
        />
      </Svg>
    </MotionConfig>
  );
};

export const LinearScaleLeft = LinearScaleChartTemplate.bind({});
LinearScaleLeft.args = {
  orientation: 'left',
  labelOrientation: 'horizontal'
};

export const LinearScaleRight = LinearScaleChartTemplate.bind({});
LinearScaleRight.args = {
  orientation: 'right',
  labelOrientation: 'horizontal'
};

export const LinearScaleTop = LinearScaleChartTemplate.bind({});
LinearScaleTop.args = {
  orientation: 'top',
  labelOrientation: 'horizontal'
};

export const LinearScaleBottom = LinearScaleChartTemplate.bind({});
LinearScaleBottom.args = {
  orientation: 'bottom',
  labelOrientation: 'horizontal'
};

export const LinearScaleLeftAngled = LinearScaleChartTemplate.bind({});
LinearScaleLeftAngled.args = {
  orientation: 'left',
  labelOrientation: 'angled'
};

export const LinearScaleRightAngled = LinearScaleChartTemplate.bind({});
LinearScaleRightAngled.args = {
  orientation: 'right',
  labelOrientation: 'angled'
};

export const LinearScaleTopAngled = LinearScaleChartTemplate.bind({});
LinearScaleTopAngled.args = {
  orientation: 'top',
  labelOrientation: 'angled'
};

export const LinearScaleBottomAngled = LinearScaleChartTemplate.bind({});
LinearScaleBottomAngled.args = {
  orientation: 'bottom',
  labelOrientation: 'angled'
};

export const LinearScaleLeftVertical = LinearScaleChartTemplate.bind({});
LinearScaleLeftVertical.args = {
  orientation: 'left',
  labelOrientation: 'vertical'
};

export const LinearScaleRightVertical = LinearScaleChartTemplate.bind({});
LinearScaleRightVertical.args = {
  orientation: 'right',
  labelOrientation: 'vertical'
};

export const LinearScaleTopVertical = LinearScaleChartTemplate.bind({});
LinearScaleTopVertical.args = {
  orientation: 'top',
  labelOrientation: 'vertical'
};

export const LinearScaleBottomVertical = LinearScaleChartTemplate.bind({});
LinearScaleBottomVertical.args = {
  orientation: 'bottom',
  labelOrientation: 'vertical'
};

const BandScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation, labelOrientation }) => {
  const margin = 40;
  const textWidthMargin = margin + (labelOrientation === 'angled' ? 34 : 40);
  const textHeightMargin = margin + (labelOrientation === 'angled' ? 34 : 14);

  const margins = {
    top:
      orientation === 'top' ? (labelOrientation === 'vertical' ? textWidthMargin : textHeightMargin) : margin,
    bottom:
      orientation === 'bottom'
        ? labelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    left:
      orientation === 'left'
        ? labelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin,
    right:
      orientation === 'right'
        ? labelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin
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
    .paddingOuter(0.5) as AxisScale<string>;

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
      <Svg width={width} height={height} className="font-sans text-base font-normal select-none bg-slate-200">
        <SvgAxis
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
          labelOrientation={labelOrientation}
          className="text-[10px]"
        />
      </Svg>
    </MotionConfig>
  );
};

export const BandScaleLeft = BandScaleChartTemplate.bind({});
BandScaleLeft.args = {
  orientation: 'left',
  labelOrientation: 'horizontal'
};

export const BandScaleRight = BandScaleChartTemplate.bind({});
BandScaleRight.args = {
  orientation: 'right',
  labelOrientation: 'horizontal'
};

export const BandScaleTop = BandScaleChartTemplate.bind({});
BandScaleTop.args = {
  orientation: 'top',
  labelOrientation: 'horizontal'
};

export const BandScaleBottom = BandScaleChartTemplate.bind({});
BandScaleBottom.args = {
  orientation: 'bottom',
  labelOrientation: 'horizontal'
};

export const BandScaleLeftAngled = BandScaleChartTemplate.bind({});
BandScaleLeftAngled.args = {
  orientation: 'left',
  labelOrientation: 'angled'
};

export const BandScaleRightAngled = BandScaleChartTemplate.bind({});
BandScaleRightAngled.args = {
  orientation: 'right',
  labelOrientation: 'angled'
};

export const BandScaleTopAngled = BandScaleChartTemplate.bind({});
BandScaleTopAngled.args = {
  orientation: 'top',
  labelOrientation: 'angled'
};

export const BandScaleBottomAngled = BandScaleChartTemplate.bind({});
BandScaleBottomAngled.args = {
  orientation: 'bottom',
  labelOrientation: 'angled'
};

export const BandScaleLeftVertical = BandScaleChartTemplate.bind({});
BandScaleLeftVertical.args = {
  orientation: 'left',
  labelOrientation: 'vertical'
};

export const BandScaleRightVertical = BandScaleChartTemplate.bind({});
BandScaleRightVertical.args = {
  orientation: 'right',
  labelOrientation: 'vertical'
};

export const BandScaleTopVertical = BandScaleChartTemplate.bind({});
BandScaleTopVertical.args = {
  orientation: 'top',
  labelOrientation: 'vertical'
};

export const BandScaleBottomVertical = BandScaleChartTemplate.bind({});
BandScaleBottomVertical.args = {
  orientation: 'bottom',
  labelOrientation: 'vertical'
};

const TimeScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation, labelOrientation }) => {
  const margin = 40;
  const textWidthMargin = margin + (labelOrientation === 'angled' ? 34 : 40);
  const textHeightMargin = margin + (labelOrientation === 'angled' ? 34 : 14);

  const margins = {
    top:
      orientation === 'top' ? (labelOrientation === 'vertical' ? textWidthMargin : textHeightMargin) : margin,
    bottom:
      orientation === 'bottom'
        ? labelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    left:
      orientation === 'left'
        ? labelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin,
    right:
      orientation === 'right'
        ? labelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin
  };

  const width = 400;
  const height = 400;
  const domain = [new Date(2000, 0, 1), new Date(2000, 9, 1)];
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;
  const scale = d3
    .scaleTime()
    .domain(domain)
    .range([0, orientation === 'top' || orientation === 'bottom' ? chartWidth : chartHeight])
    .nice() as AxisScale<Date>;

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
      <Svg width={width} height={height} className="font-sans text-base font-normal select-none bg-slate-200">
        <SvgAxis
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickArguments={[d3.timeMonth.every(3)]}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
          labelOrientation={labelOrientation}
          className="text-[10px]"
        />
      </Svg>
    </MotionConfig>
  );
};

export const TimeScaleLeft = TimeScaleChartTemplate.bind({});
TimeScaleLeft.args = {
  orientation: 'left',
  labelOrientation: 'horizontal'
};

export const TimeScaleRight = TimeScaleChartTemplate.bind({});
TimeScaleRight.args = {
  orientation: 'right',
  labelOrientation: 'horizontal'
};

export const TimeScaleTop = TimeScaleChartTemplate.bind({});
TimeScaleTop.args = {
  orientation: 'top',
  labelOrientation: 'horizontal'
};

export const TimeScaleBottom = TimeScaleChartTemplate.bind({});
TimeScaleBottom.args = {
  orientation: 'bottom',
  labelOrientation: 'horizontal'
};

export const TimeScaleLeftAngled = TimeScaleChartTemplate.bind({});
TimeScaleLeftAngled.args = {
  orientation: 'left',
  labelOrientation: 'angled'
};

export const TimeScaleRightAngled = TimeScaleChartTemplate.bind({});
TimeScaleRightAngled.args = {
  orientation: 'right',
  labelOrientation: 'angled'
};

export const TimeScaleTopAngled = TimeScaleChartTemplate.bind({});
TimeScaleTopAngled.args = {
  orientation: 'top',
  labelOrientation: 'angled'
};

export const TimeScaleBottomAngled = TimeScaleChartTemplate.bind({});
TimeScaleBottomAngled.args = {
  orientation: 'bottom',
  labelOrientation: 'angled'
};

export const TimeScaleLeftVertical = TimeScaleChartTemplate.bind({});
TimeScaleLeftVertical.args = {
  orientation: 'left',
  labelOrientation: 'vertical'
};

export const TimeScaleRightVertical = TimeScaleChartTemplate.bind({});
TimeScaleRightVertical.args = {
  orientation: 'right',
  labelOrientation: 'vertical'
};

export const TimeScaleTopVertical = TimeScaleChartTemplate.bind({});
TimeScaleTopVertical.args = {
  orientation: 'top',
  labelOrientation: 'vertical'
};

export const TimeScaleBottomVertical = TimeScaleChartTemplate.bind({});
TimeScaleBottomVertical.args = {
  orientation: 'bottom',
  labelOrientation: 'vertical'
};

const PointScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation, labelOrientation }) => {
  const margin = 40;
  const textWidthMargin = margin + (labelOrientation === 'angled' ? 28 : 34);
  const textHeightMargin = margin + (labelOrientation === 'angled' ? 28 : 14);

  const margins = {
    top:
      orientation === 'top' ? (labelOrientation === 'vertical' ? textWidthMargin : textHeightMargin) : margin,
    bottom:
      orientation === 'bottom'
        ? labelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    left:
      orientation === 'left'
        ? labelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin,
    right:
      orientation === 'right'
        ? labelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin
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
    .padding(0.5) as AxisScale<string>;

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
      <Svg width={width} height={height} className="font-sans text-base font-normal select-none bg-slate-200">
        <SvgAxis
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          orientation={orientation}
          tickSizeInner={null}
          tickSizeOuter={orientation === 'top' || orientation === 'bottom' ? -chartHeight : -chartWidth}
          labelOrientation={labelOrientation}
          className="text-[10px]"
        />
      </Svg>
    </MotionConfig>
  );
};

export const PointScaleLeft = PointScaleChartTemplate.bind({});
PointScaleLeft.args = {
  orientation: 'left',
  labelOrientation: 'horizontal'
};

export const PointScaleRight = PointScaleChartTemplate.bind({});
PointScaleRight.args = {
  orientation: 'right',
  labelOrientation: 'horizontal'
};

export const PointScaleTop = PointScaleChartTemplate.bind({});
PointScaleTop.args = {
  orientation: 'top',
  labelOrientation: 'horizontal'
};

export const PointScaleBottom = PointScaleChartTemplate.bind({});
PointScaleBottom.args = {
  orientation: 'bottom',
  labelOrientation: 'horizontal'
};

export const PointScaleLeftAngled = PointScaleChartTemplate.bind({});
PointScaleLeftAngled.args = {
  orientation: 'left',
  labelOrientation: 'angled'
};

export const PointScaleRightAngled = PointScaleChartTemplate.bind({});
PointScaleRightAngled.args = {
  orientation: 'right',
  labelOrientation: 'angled'
};

export const PointScaleTopAngled = PointScaleChartTemplate.bind({});
PointScaleTopAngled.args = {
  orientation: 'top',
  labelOrientation: 'angled'
};

export const PointScaleBottomAngled = PointScaleChartTemplate.bind({});
PointScaleBottomAngled.args = {
  orientation: 'bottom',
  labelOrientation: 'angled'
};

export const PointScaleLeftVertical = PointScaleChartTemplate.bind({});
PointScaleLeftVertical.args = {
  orientation: 'left',
  labelOrientation: 'vertical'
};

export const PointScaleRightVertical = PointScaleChartTemplate.bind({});
PointScaleRightVertical.args = {
  orientation: 'right',
  labelOrientation: 'vertical'
};

export const PointScaleTopVertical = PointScaleChartTemplate.bind({});
PointScaleTopVertical.args = {
  orientation: 'top',
  labelOrientation: 'vertical'
};

export const PointScaleBottomVertical = PointScaleChartTemplate.bind({});
PointScaleBottomVertical.args = {
  orientation: 'bottom',
  labelOrientation: 'vertical'
};
