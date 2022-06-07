import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';

function HistogramPage() {
  return (
    <main>
      <PageHeading>Histogram</PageHeading>
      <Helmet>
        <title>Histogram - React and D3</title>
      </Helmet>
      <div className="w-full max-w-3xl p-4 mx-auto space-y-8 md:p-8">TODO</div>
    </main>
  );
}

export default HistogramPage;
