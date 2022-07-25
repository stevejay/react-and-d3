import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';

import { RespondentsByCountry } from './RespondentsByCountry';
import { RespondentsByLanguage } from './RespondentsByLanguage';

function StateOfJSPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>State of JS</PageHeading>
      <Helmet>
        <title>State of JavaScript</title>
      </Helmet>
      <div className="space-y-16">
        <RespondentsByCountry />
        <RespondentsByLanguage />
      </div>
    </main>
  );
}

export default StateOfJSPage;
