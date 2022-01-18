import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseExternalLink } from '@/components/ProseExternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChartExample } from './BarChartExample';

const VisxPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Visx by Airbnb</PageHeading>
    <Paragraph>
      This page is for assessing how{' '}
      <ProseExternalLink href="https://airbnb.io/visx/">Visx</ProseExternalLink> performs in creating data
      visualisations.
    </Paragraph>
    <SectionHeading>Bar Chart</SectionHeading>
    <BarChartExample />
  </div>
);

export default VisxPage;
