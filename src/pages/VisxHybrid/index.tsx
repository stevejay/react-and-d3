import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChartExample } from './BarChartExample';
import { GroupedBarChartExample } from './GroupedBarChartExample';
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
      {true && <StackedBarChartExample />}
      {true && <GroupedBarChartExample />}
      {true && <BarChartExample />}
      {true && <RespondentsByLanguage />}
    </main>
  );
}

export default VisxHybridPage;
