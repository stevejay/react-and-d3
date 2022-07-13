import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';

import { Language } from './Language';
import { RespondentsPerCountry } from './RespondentsPerCountry';

function StateOfJSPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>State of JS</PageHeading>
      <Helmet>
        <title>State of JavaScript</title>
      </Helmet>
      <RespondentsPerCountry />
      <Language />
    </main>
  );
}

export default StateOfJSPage;
