import { ComponentMeta, Story } from '@storybook/react';
import { easeCubicInOut } from 'd3-ease';
import { scaleBand, scaleLinear, scalePoint, scaleTime } from 'd3-scale';
import { timeMonth } from 'd3-time';

import { Svg } from '@/components/Svg';
import { SvgAxis } from '@/components/SvgAxis';
import { useChartArea } from '@/hooks/useChartArea';
import type { AxisScale, TickLabelOrientation } from '@/types';

const springConfig = { duration: 500, easing: easeCubicInOut };

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
  tickLabelOrientation: TickLabelOrientation;
};

const LinearScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation, tickLabelOrientation }) => {
  const margin = 40;
  const textWidthMargin = margin + (tickLabelOrientation === 'angled' ? 28 : 34);
  const textHeightMargin = margin + (tickLabelOrientation === 'angled' ? 28 : 14);

  const margins = {
    top:
      orientation === 'top'
        ? tickLabelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    bottom:
      orientation === 'bottom'
        ? tickLabelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    left:
      orientation === 'left'
        ? tickLabelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin,
    right:
      orientation === 'right'
        ? tickLabelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin
  };

  const width = 400;
  const height = 400;
  const domain = [-10, 60];
  const chartArea = useChartArea(width, height, margins);

  const scale = scaleLinear()
    .domain(domain)
    .range([0, orientation === 'top' || orientation === 'bottom' ? chartArea.width : chartArea.height])
    .nice() as AxisScale<number>;

  return (
    <Svg width={width} height={height} className="font-sans text-base font-normal select-none bg-slate-200">
      <SvgAxis
        scale={scale}
        chartArea={chartArea}
        orientation={orientation}
        tickArguments={[5, 'X']}
        tickSizeInner={null}
        tickSizeOuter={
          orientation === 'top' || orientation === 'bottom' ? -chartArea.height : -chartArea.width
        }
        tickLabelOrientation={tickLabelOrientation}
        className="text-[10px]"
        springConfig={springConfig}
      />
    </Svg>
  );
};

export const LinearScaleLeft = LinearScaleChartTemplate.bind({});
LinearScaleLeft.args = {
  orientation: 'left',
  tickLabelOrientation: 'horizontal'
};

export const LinearScaleRight = LinearScaleChartTemplate.bind({});
LinearScaleRight.args = {
  orientation: 'right',
  tickLabelOrientation: 'horizontal'
};

export const LinearScaleTop = LinearScaleChartTemplate.bind({});
LinearScaleTop.args = {
  orientation: 'top',
  tickLabelOrientation: 'horizontal'
};

export const LinearScaleBottom = LinearScaleChartTemplate.bind({});
LinearScaleBottom.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'horizontal'
};

export const LinearScaleLeftAngled = LinearScaleChartTemplate.bind({});
LinearScaleLeftAngled.args = {
  orientation: 'left',
  tickLabelOrientation: 'angled'
};

export const LinearScaleRightAngled = LinearScaleChartTemplate.bind({});
LinearScaleRightAngled.args = {
  orientation: 'right',
  tickLabelOrientation: 'angled'
};

export const LinearScaleTopAngled = LinearScaleChartTemplate.bind({});
LinearScaleTopAngled.args = {
  orientation: 'top',
  tickLabelOrientation: 'angled'
};

export const LinearScaleBottomAngled = LinearScaleChartTemplate.bind({});
LinearScaleBottomAngled.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'angled'
};

export const LinearScaleLeftVertical = LinearScaleChartTemplate.bind({});
LinearScaleLeftVertical.args = {
  orientation: 'left',
  tickLabelOrientation: 'vertical'
};

export const LinearScaleRightVertical = LinearScaleChartTemplate.bind({});
LinearScaleRightVertical.args = {
  orientation: 'right',
  tickLabelOrientation: 'vertical'
};

export const LinearScaleTopVertical = LinearScaleChartTemplate.bind({});
LinearScaleTopVertical.args = {
  orientation: 'top',
  tickLabelOrientation: 'vertical'
};

export const LinearScaleBottomVertical = LinearScaleChartTemplate.bind({});
LinearScaleBottomVertical.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'vertical'
};

const BandScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation, tickLabelOrientation }) => {
  const margin = 40;
  const textWidthMargin = margin + (tickLabelOrientation === 'angled' ? 34 : 40);
  const textHeightMargin = margin + (tickLabelOrientation === 'angled' ? 34 : 14);

  const margins = {
    top:
      orientation === 'top'
        ? tickLabelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    bottom:
      orientation === 'bottom'
        ? tickLabelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    left:
      orientation === 'left'
        ? tickLabelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin,
    right:
      orientation === 'right'
        ? tickLabelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin
  };

  const width = 400;
  const height = 400;
  const domain = ['Apple', 'Orange', 'Banana', 'Pear', 'Grape'];
  const chartArea = useChartArea(width, height, margins);

  const scale = scaleBand()
    .domain(domain)
    .rangeRound([0, orientation === 'top' || orientation === 'bottom' ? chartArea.width : chartArea.height])
    .paddingOuter(0.5) as AxisScale<string>;

  return (
    <Svg width={width} height={height} className="font-sans text-base font-normal select-none bg-slate-200">
      <SvgAxis
        scale={scale}
        chartArea={chartArea}
        orientation={orientation}
        tickSizeInner={null}
        tickSizeOuter={
          orientation === 'top' || orientation === 'bottom' ? -chartArea.height : -chartArea.width
        }
        tickLabelOrientation={tickLabelOrientation}
        className="text-[10px]"
        springConfig={springConfig}
      />
    </Svg>
  );
};

export const BandScaleLeft = BandScaleChartTemplate.bind({});
BandScaleLeft.args = {
  orientation: 'left',
  tickLabelOrientation: 'horizontal'
};

export const BandScaleRight = BandScaleChartTemplate.bind({});
BandScaleRight.args = {
  orientation: 'right',
  tickLabelOrientation: 'horizontal'
};

export const BandScaleTop = BandScaleChartTemplate.bind({});
BandScaleTop.args = {
  orientation: 'top',
  tickLabelOrientation: 'horizontal'
};

export const BandScaleBottom = BandScaleChartTemplate.bind({});
BandScaleBottom.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'horizontal'
};

export const BandScaleLeftAngled = BandScaleChartTemplate.bind({});
BandScaleLeftAngled.args = {
  orientation: 'left',
  tickLabelOrientation: 'angled'
};

export const BandScaleRightAngled = BandScaleChartTemplate.bind({});
BandScaleRightAngled.args = {
  orientation: 'right',
  tickLabelOrientation: 'angled'
};

export const BandScaleTopAngled = BandScaleChartTemplate.bind({});
BandScaleTopAngled.args = {
  orientation: 'top',
  tickLabelOrientation: 'angled'
};

export const BandScaleBottomAngled = BandScaleChartTemplate.bind({});
BandScaleBottomAngled.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'angled'
};

export const BandScaleLeftVertical = BandScaleChartTemplate.bind({});
BandScaleLeftVertical.args = {
  orientation: 'left',
  tickLabelOrientation: 'vertical'
};

export const BandScaleRightVertical = BandScaleChartTemplate.bind({});
BandScaleRightVertical.args = {
  orientation: 'right',
  tickLabelOrientation: 'vertical'
};

export const BandScaleTopVertical = BandScaleChartTemplate.bind({});
BandScaleTopVertical.args = {
  orientation: 'top',
  tickLabelOrientation: 'vertical'
};

export const BandScaleBottomVertical = BandScaleChartTemplate.bind({});
BandScaleBottomVertical.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'vertical'
};

const TimeScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation, tickLabelOrientation }) => {
  const margin = 40;
  const textWidthMargin = margin + (tickLabelOrientation === 'angled' ? 34 : 40);
  const textHeightMargin = margin + (tickLabelOrientation === 'angled' ? 34 : 14);

  const margins = {
    top:
      orientation === 'top'
        ? tickLabelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    bottom:
      orientation === 'bottom'
        ? tickLabelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    left:
      orientation === 'left'
        ? tickLabelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin,
    right:
      orientation === 'right'
        ? tickLabelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin
  };

  const width = 400;
  const height = 400;
  const domain = [new Date(2000, 0, 1), new Date(2000, 9, 1)];
  const chartArea = useChartArea(width, height, margins);

  const scale = scaleTime()
    .domain(domain)
    .range([0, orientation === 'top' || orientation === 'bottom' ? chartArea.width : chartArea.height])
    .nice() as AxisScale<Date>;

  return (
    <Svg width={width} height={height} className="font-sans text-base font-normal select-none bg-slate-200">
      <SvgAxis
        scale={scale}
        chartArea={chartArea}
        orientation={orientation}
        tickArguments={[timeMonth.every(3)]}
        tickSizeInner={null}
        tickSizeOuter={
          orientation === 'top' || orientation === 'bottom' ? -chartArea.height : -chartArea.width
        }
        tickLabelOrientation={tickLabelOrientation}
        className="text-[10px]"
        springConfig={springConfig}
      />
    </Svg>
  );
};

export const TimeScaleLeft = TimeScaleChartTemplate.bind({});
TimeScaleLeft.args = {
  orientation: 'left',
  tickLabelOrientation: 'horizontal'
};

export const TimeScaleRight = TimeScaleChartTemplate.bind({});
TimeScaleRight.args = {
  orientation: 'right',
  tickLabelOrientation: 'horizontal'
};

export const TimeScaleTop = TimeScaleChartTemplate.bind({});
TimeScaleTop.args = {
  orientation: 'top',
  tickLabelOrientation: 'horizontal'
};

export const TimeScaleBottom = TimeScaleChartTemplate.bind({});
TimeScaleBottom.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'horizontal'
};

export const TimeScaleLeftAngled = TimeScaleChartTemplate.bind({});
TimeScaleLeftAngled.args = {
  orientation: 'left',
  tickLabelOrientation: 'angled'
};

export const TimeScaleRightAngled = TimeScaleChartTemplate.bind({});
TimeScaleRightAngled.args = {
  orientation: 'right',
  tickLabelOrientation: 'angled'
};

export const TimeScaleTopAngled = TimeScaleChartTemplate.bind({});
TimeScaleTopAngled.args = {
  orientation: 'top',
  tickLabelOrientation: 'angled'
};

export const TimeScaleBottomAngled = TimeScaleChartTemplate.bind({});
TimeScaleBottomAngled.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'angled'
};

export const TimeScaleLeftVertical = TimeScaleChartTemplate.bind({});
TimeScaleLeftVertical.args = {
  orientation: 'left',
  tickLabelOrientation: 'vertical'
};

export const TimeScaleRightVertical = TimeScaleChartTemplate.bind({});
TimeScaleRightVertical.args = {
  orientation: 'right',
  tickLabelOrientation: 'vertical'
};

export const TimeScaleTopVertical = TimeScaleChartTemplate.bind({});
TimeScaleTopVertical.args = {
  orientation: 'top',
  tickLabelOrientation: 'vertical'
};

export const TimeScaleBottomVertical = TimeScaleChartTemplate.bind({});
TimeScaleBottomVertical.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'vertical'
};

const PointScaleChartTemplate: Story<ChartTemplateProps> = ({ orientation, tickLabelOrientation }) => {
  const margin = 40;
  const textWidthMargin = margin + (tickLabelOrientation === 'angled' ? 28 : 34);
  const textHeightMargin = margin + (tickLabelOrientation === 'angled' ? 28 : 14);

  const margins = {
    top:
      orientation === 'top'
        ? tickLabelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    bottom:
      orientation === 'bottom'
        ? tickLabelOrientation === 'vertical'
          ? textWidthMargin
          : textHeightMargin
        : margin,
    left:
      orientation === 'left'
        ? tickLabelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin,
    right:
      orientation === 'right'
        ? tickLabelOrientation === 'vertical'
          ? textHeightMargin
          : textWidthMargin
        : margin
  };

  const width = 400;
  const height = 400;
  const domain = ['Red', 'Green', 'Black', 'Blue'];
  const chartArea = useChartArea(width, height, margins);

  const scale = scalePoint()
    .domain(domain)
    .rangeRound([0, orientation === 'top' || orientation === 'bottom' ? chartArea.width : chartArea.height])
    .padding(0.5) as AxisScale<string>;

  return (
    <Svg width={width} height={height} className="font-sans text-base font-normal select-none bg-slate-200">
      <SvgAxis
        scale={scale}
        chartArea={chartArea}
        orientation={orientation}
        tickSizeInner={null}
        tickSizeOuter={
          orientation === 'top' || orientation === 'bottom' ? -chartArea.height : -chartArea.width
        }
        tickLabelOrientation={tickLabelOrientation}
        className="text-[10px]"
        springConfig={springConfig}
      />
    </Svg>
  );
};

export const PointScaleLeft = PointScaleChartTemplate.bind({});
PointScaleLeft.args = {
  orientation: 'left',
  tickLabelOrientation: 'horizontal'
};

export const PointScaleRight = PointScaleChartTemplate.bind({});
PointScaleRight.args = {
  orientation: 'right',
  tickLabelOrientation: 'horizontal'
};

export const PointScaleTop = PointScaleChartTemplate.bind({});
PointScaleTop.args = {
  orientation: 'top',
  tickLabelOrientation: 'horizontal'
};

export const PointScaleBottom = PointScaleChartTemplate.bind({});
PointScaleBottom.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'horizontal'
};

export const PointScaleLeftAngled = PointScaleChartTemplate.bind({});
PointScaleLeftAngled.args = {
  orientation: 'left',
  tickLabelOrientation: 'angled'
};

export const PointScaleRightAngled = PointScaleChartTemplate.bind({});
PointScaleRightAngled.args = {
  orientation: 'right',
  tickLabelOrientation: 'angled'
};

export const PointScaleTopAngled = PointScaleChartTemplate.bind({});
PointScaleTopAngled.args = {
  orientation: 'top',
  tickLabelOrientation: 'angled'
};

export const PointScaleBottomAngled = PointScaleChartTemplate.bind({});
PointScaleBottomAngled.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'angled'
};

export const PointScaleLeftVertical = PointScaleChartTemplate.bind({});
PointScaleLeftVertical.args = {
  orientation: 'left',
  tickLabelOrientation: 'vertical'
};

export const PointScaleRightVertical = PointScaleChartTemplate.bind({});
PointScaleRightVertical.args = {
  orientation: 'right',
  tickLabelOrientation: 'vertical'
};

export const PointScaleTopVertical = PointScaleChartTemplate.bind({});
PointScaleTopVertical.args = {
  orientation: 'top',
  tickLabelOrientation: 'vertical'
};

export const PointScaleBottomVertical = PointScaleChartTemplate.bind({});
PointScaleBottomVertical.args = {
  orientation: 'bottom',
  tickLabelOrientation: 'vertical'
};
