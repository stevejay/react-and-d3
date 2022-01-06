import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseInternalLink } from '@/components/ProseInternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { HorizontalBarChartExample } from './HorizontalBarChartExample';
import { VerticalBarChartExample } from './VerticalBarChartExample';

const BarChartPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Bar Chart</PageHeading>
    <SectionHeading>Vertical Bar Chart</SectionHeading>
    <Paragraph>
      The following is an example of a vertical bar chart. You can see a version with tooltips on the{' '}
      <ProseInternalLink to="/tooltip">tooltip page</ProseInternalLink>.
    </Paragraph>
    <VerticalBarChartExample />
    <SectionHeading>Horizontal Bar Chart</SectionHeading>
    <Paragraph>
      The following is an example of a horizontal bar chart. You can see a version with tooltips on the{' '}
      <ProseInternalLink to="/tooltip">tooltip page</ProseInternalLink>.
    </Paragraph>
    <HorizontalBarChartExample />
  </div>
);

export default BarChartPage;
