import { PageHeading } from '@/components/PageHeading';

import { SparklineExamples } from './SparklineExamples';

const Sparkline = () => (
  <>
    <PageHeading>Sparkline</PageHeading>
    <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <SparklineExamples />
    </div>
  </>
);

export default Sparkline;
