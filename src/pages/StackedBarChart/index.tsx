import { HorizontalRule } from '@/components/HorizontalRule';
import { PageHeading } from '@/components/PageHeading';

import { HorizontalStackedBarChartExample } from './HorizontalStackedBarChartExample';
import { VerticalStackedBarChartExample } from './VerticalStackedBarChartExample';

const StackedBarChartPage = () => (
  <>
    <PageHeading>Stacked Bar Chart</PageHeading>
    <div className="w-full max-w-3xl p-4 mx-auto space-y-8 md:p-8">
      <VerticalStackedBarChartExample />
      <HorizontalRule />
      <HorizontalStackedBarChartExample />
    </div>
  </>
);

export default StackedBarChartPage;
