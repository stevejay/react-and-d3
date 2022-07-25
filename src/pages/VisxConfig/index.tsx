import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChart } from './BarChart';
import { RespondentsByLanguage } from './RespondentsByLanguage';

function VisxConfigPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Visx Config</PageHeading>
      <Helmet>
        <title>Visx Config - React and D3</title>
      </Helmet>
      <Paragraph>
        This page is for creating a version of Visx that has better animations and extensibility.
      </Paragraph>
      <SectionHeading>Bar Chart</SectionHeading>
      <BarChart />
      <RespondentsByLanguage />
    </main>
  );
}

export default VisxConfigPage;
