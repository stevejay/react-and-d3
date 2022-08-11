import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChartExample } from './BarChartExample';
import { EmptyBarChart } from './EmptyBarChart';
import { GroupedBarChartExample } from './GroupedBarChartExample';
// import { AreaChartExample } from './AreaChartExample';
import { LineChartExample } from './LineChartExample';
import { RespondentsByLanguage } from './RespondentsByLanguage';
import { StackedBarChartExample } from './StackedBarChartExample';

function VisxHybridPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Visx Hybrid</PageHeading>
      <Helmet>
        <title>Visx Hybrid - React and D3</title>
      </Helmet>
      <Paragraph>
        This page is for creating a version of Visx that has better animations and extensibility.
      </Paragraph>
      <SectionHeading>Bar Chart</SectionHeading>
      {true && <LineChartExample />}
      {/* {true && <AreaChartExample />} */}
      {false && <StackedBarChartExample />}
      {false && <GroupedBarChartExample />}
      {false && <BarChartExample />}
      {false && <RespondentsByLanguage />}
      {false && <EmptyBarChart />}
    </main>
  );
}

export default VisxHybridPage;
