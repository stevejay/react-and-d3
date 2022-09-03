import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseExternalLink } from '@/components/ProseExternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { ClippdBarChart } from './ClippdBarChart';
import { RespondentsByLanguageBarChart } from './RespondentsByLanguageBarChart';
import { VerticalBarChartExample } from './VerticalBarChartExample';

function BarChartPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Bar Chart</PageHeading>
      <Helmet>
        <title>Bar Chart - React and D3</title>
      </Helmet>
      <SectionHeading>Vertical Bar Chart</SectionHeading>
      <Paragraph>The following is an example of a basic vertical bar chart:</Paragraph>
      <VerticalBarChartExample />
      <Paragraph>
        The following is a vertical bar chart styled in a similar way to those in the{' '}
        <ProseExternalLink href="https://www.clippd.com/">Clippd</ProseExternalLink> golf app:
      </Paragraph>
      <ClippdBarChart />
      <SectionHeading>Horizontal Bar Chart</SectionHeading>
      <Paragraph>
        The following is an example of a horizontal bar chart. It displays data from the{' '}
        <ProseExternalLink href="https://2021.stateofjs.com/en-US/demographics/#locale">
          2021 State of JavaScript survey
        </ProseExternalLink>
        . You can choose which statistic to render.
      </Paragraph>
      <RespondentsByLanguageBarChart />
    </main>
  );
}

export default BarChartPage;
