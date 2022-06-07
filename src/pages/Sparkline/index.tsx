import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { SectionHeading } from '@/components/SectionHeading';

import { SparklineExamples } from './SparklineExamples';

function Sparkline() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Sparkline</PageHeading>
      <Helmet>
        <title>Sparkline - React and D3</title>
      </Helmet>
      <SectionHeading>Basic Sparkline</SectionHeading>
      <SparklineExamples />
    </main>
  );
}

export default Sparkline;
