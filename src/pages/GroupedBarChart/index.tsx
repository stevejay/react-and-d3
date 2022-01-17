import { easeCubicInOut } from 'd3-ease';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { HorizontalGroupedBarChartExample } from './HorizontalGroupedBarChartExample';
import { VerticalGroupedBarChartExample } from './VerticalGroupedBarChartExample';

const springConfig = { duration: 500, easing: easeCubicInOut };

const GroupedBarChartPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Grouped Bar Chart</PageHeading>
    <SectionHeading>Horizontal Grouped Bar Chart</SectionHeading>
    <Paragraph>The following is an example of a horizontal grouped bar chart.</Paragraph>
    <HorizontalGroupedBarChartExample springConfig={springConfig} />
    <SectionHeading>Vertical Grouped Bar Chart</SectionHeading>
    <Paragraph>The following is an example of a vertical grouped bar chart.</Paragraph>
    <VerticalGroupedBarChartExample springConfig={springConfig} />
  </div>
);

export default GroupedBarChartPage;
