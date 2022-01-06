import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { VerticalStackedBarChartExample } from './VerticalStackedBarChartExample';

const AccessibilityPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Accessibility</PageHeading>
    <SectionHeading>An Accessible Stacked Bar Chart</SectionHeading>
    <Paragraph>This is an example of an accessible stacked bar chart.</Paragraph>
    <VerticalStackedBarChartExample />
  </div>
);

export default AccessibilityPage;
