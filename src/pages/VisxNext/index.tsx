import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChartExample } from './BarChartExample';
import { GroupedBarChartExample } from './GroupedBarChartExample';
import { StackedBarChartExample } from './StackedBarChartExample';

function VisxNextPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Visx Next</PageHeading>
      <Helmet>
        <title>Visx Next - React and D3</title>
      </Helmet>
      <Paragraph>
        This page is for creating a version of Visx that has better animations and extensibility.
      </Paragraph>
      <SectionHeading>Bar Chart</SectionHeading>
      <BarChartExample />
      <StackedBarChartExample />
      <GroupedBarChartExample />
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width={8}
        height={4}
        viewBox="0 0 8 4"
        style={{ backgroundColor: 'white' }}
      >
        <line x1={2} y1={2} x2={6} y2={2} strokeWidth={1} stroke="red" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={4}
        height={8}
        viewBox="0 0 4 8"
        style={{ backgroundColor: 'white' }}
      >
        <line x1={2} y1={2} x2={2} y2={6} strokeWidth={1} stroke="red" />
      </svg> */}
    </main>
  );
}

// horizontal line needs y + offset.
// vertical line needs x + offset.

export default VisxNextPage;
