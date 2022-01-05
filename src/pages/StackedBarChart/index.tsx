import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { HorizontalStackedBarChartExample } from './HorizontalStackedBarChartExample';
import { VerticalStackedBarChartExample } from './VerticalStackedBarChartExample';

const StackedBarChartPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Stacked Bar Chart</PageHeading>
    <SectionHeading>Vertical Stacked Bar Chart</SectionHeading>
    <Paragraph>This is an example of a vertical stacked bar chart.</Paragraph>
    <VerticalStackedBarChartExample />
    <SectionHeading>Horizontal Stacked Bar Chart</SectionHeading>
    <Paragraph>This is an example of a horizontal stacked bar chart.</Paragraph>
    <HorizontalStackedBarChartExample />
  </div>
);

export default StackedBarChartPage;
