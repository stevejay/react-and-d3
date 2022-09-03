import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseExternalLink } from '@/components/ProseExternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { RespondentsByCountry } from './RespondentsByCountry';

function MapPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Map</PageHeading>
      <Helmet>
        <title>Map - React and D3</title>
      </Helmet>
      <SectionHeading>Respondents per country (Choropleth map)</SectionHeading>
      <Paragraph>
        These maps use data from the 2021 State of JS survey. The equivalent map in the results for the survey
        can be found{' '}
        <ProseExternalLink href="https://2021.stateofjs.com/en-US/demographics/">here</ProseExternalLink>.
      </Paragraph>
      <div className="space-y-16">
        <RespondentsByCountry />
      </div>
    </main>
  );
}

export default MapPage;
