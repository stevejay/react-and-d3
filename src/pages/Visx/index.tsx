import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseExternalLink } from '@/components/ProseExternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChartExample } from './BarChartExample';

function VisxPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Visx by Airbnb</PageHeading>
      <Helmet>
        <title>Visx by Airbnb - React and D3</title>
      </Helmet>
      <Paragraph>
        This page is for assessing how{' '}
        <ProseExternalLink href="https://airbnb.io/visx/">Visx</ProseExternalLink> performs in creating data
        visualisations.
      </Paragraph>
      <SectionHeading>Bar Chart</SectionHeading>
      <BarChartExample />
    </main>
  );
}

export default VisxPage;
