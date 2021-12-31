import { PageHeading } from '@/components/PageHeading';

import { BarChartExamples } from './BarChartExamples';

const BarChartPage = () => (
  <>
    <PageHeading>Bar Chart</PageHeading>
    <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <BarChartExamples transitionSeconds={0.5} />
    </div>
  </>
);

export default BarChartPage;
