import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { HorizontalStackedBarChartExample } from './HorizontalStackedBarChartExample';
import { VerticalStackedBarChartExample } from './VerticalStackedBarChartExample';

function StackedBarChartPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Stacked Bar Chart</PageHeading>
      <Helmet>
        <title>Stacked Bar Chart - React and D3</title>
      </Helmet>
      <SectionHeading>Vertical Stacked Bar Chart</SectionHeading>
      <Paragraph>The following is an example of a vertical stacked bar chart:</Paragraph>
      <VerticalStackedBarChartExample />
      <SectionHeading>Horizontal Stacked Bar Chart</SectionHeading>
      <Paragraph>The following is an example of a horizontal stacked bar chart:</Paragraph>
      <HorizontalStackedBarChartExample />
      <Paragraph>
        For the best animations with a stacked bar chart, include all the same series in the data, even if
        sometimes a series might be missing in the source data. (You would need to add each missing series
        with all zero values.) This is so that the bars for an exiting series animate to zero on exit and from
        zero on entry.
      </Paragraph>
    </main>
  );
}

export default StackedBarChartPage;
