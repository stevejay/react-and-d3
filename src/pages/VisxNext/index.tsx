import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChartExample } from './BarChartExample';

const VisxNextPage = () => (
  <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Visx Next</PageHeading>
    <Paragraph>
      This page is for creating a version of Visx that has better animations and extensibility.
    </Paragraph>
    <SectionHeading>Bar Chart</SectionHeading>
    <BarChartExample />
  </main>
);

export default VisxNextPage;
