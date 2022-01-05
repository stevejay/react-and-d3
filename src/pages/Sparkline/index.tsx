import { PageHeading } from '@/components/PageHeading';
import { SectionHeading } from '@/components/SectionHeading';

import { SparklineExamples } from './SparklineExamples';

const Sparkline = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Sparkline</PageHeading>
    <SectionHeading>Basic Sparkline</SectionHeading>
    <SparklineExamples />
  </div>
);

export default Sparkline;
