import { easeCubicInOut } from 'd3-ease';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { HorizontalStackedBarChartExample } from './HorizontalStackedBarChartExample';
import { VerticalStackedBarChartExample } from './VerticalStackedBarChartExample';

const springConfig = { duration: 500, easing: easeCubicInOut };

const StackedBarChartPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Stacked Bar Chart</PageHeading>
    <SectionHeading>Vertical Stacked Bar Chart</SectionHeading>
    <Paragraph>
      A stacked bar chart differs from a regular bar chart in that it displays multiple series of data, rather
      than a single series. The following is an example of a vertical stacked bar chart.
    </Paragraph>
    <VerticalStackedBarChartExample springConfig={springConfig} />
    <SectionHeading>Horizontal Stacked Bar Chart</SectionHeading>
    <Paragraph>The following is an example of a horizontal stacked bar chart.</Paragraph>
    <HorizontalStackedBarChartExample springConfig={springConfig} />
    <Paragraph>
      If you are animating the chart then you need to ensure that the same series are included in the
      displayed data, even if sometimes a series might be missing in the source data. In that case you would
      need to include the series with all zero values. This is so the bars for the series know where to
      animate to when they disappear and where to animate from when they appear.
    </Paragraph>
  </div>
);

export default StackedBarChartPage;
