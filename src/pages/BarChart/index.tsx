import { HorizontalRule } from '@/components/HorizontalRule';
import { PageHeading } from '@/components/PageHeading';

import { HorizontalBarChartExample } from './HorizontalBarChartExample';
import { VerticalBarChartExample } from './VerticalBarChartExample';

const BarChartPage = () => (
  <>
    <PageHeading>Bar Chart</PageHeading>
    <div className="w-full max-w-3xl p-4 mx-auto space-y-8 md:p-8">
      <VerticalBarChartExample />
      <HorizontalRule />
      <HorizontalBarChartExample />
    </div>
  </>
);

export default BarChartPage;
