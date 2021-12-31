import { HorizontalRule } from '@/components/HorizontalRule';
import { PageHeading } from '@/components/PageHeading';

import { HorizontalBarChartExamples } from './HorizontalBarChartExamples';
import { VerticalBarChartExamples } from './VerticalBarChartExamples';

const BarChartPage = () => (
  <>
    <PageHeading>Bar Chart</PageHeading>
    <div className="w-full max-w-3xl p-4 mx-auto space-y-8 md:p-8">
      <VerticalBarChartExamples transitionSeconds={0.5} />
      <HorizontalRule />
      <HorizontalBarChartExamples transitionSeconds={0.5} />
    </div>
  </>
);

export default BarChartPage;
