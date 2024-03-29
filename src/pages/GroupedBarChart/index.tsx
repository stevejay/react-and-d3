import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { HorizontalGroupedBarChartExample } from './HorizontalGroupedBarChartExample';
import { VerticalGroupedBarChartExample } from './VerticalGroupedBarChartExample';

function GroupedBarChartPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Grouped Bar Chart</PageHeading>
      <Helmet>
        <title>Grouped Bar Chart - React and D3</title>
      </Helmet>
      <SectionHeading>Vertical Grouped Bar Chart</SectionHeading>
      <Paragraph>The following is an example of a vertical grouped bar chart:</Paragraph>
      <VerticalGroupedBarChartExample />
      <SectionHeading>Horizontal Grouped Bar Chart</SectionHeading>
      <Paragraph>The following is an example of a horizontal grouped bar chart:</Paragraph>
      <HorizontalGroupedBarChartExample />
    </main>
  );
}

export default GroupedBarChartPage;
