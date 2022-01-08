import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { VerticalGroupedBarChartExample } from './VerticalGroupedBarChartExample';

const GroupedBarChartPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Grouped Bar Chart</PageHeading>
    <SectionHeading>Vertical Grouped Bar Chart</SectionHeading>
    <Paragraph>The following is an example of a vertical grouped bar chart.</Paragraph>
    <VerticalGroupedBarChartExample />
  </div>
);

export default GroupedBarChartPage;
