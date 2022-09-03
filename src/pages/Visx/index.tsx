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
        visualisations, in particular the XYChart component. Visx is impressive and full-featured but I have
        found some issues:
      </Paragraph>
      <ul className="px-8 my-4 font-light leading-relaxed list-disc max-w-prose text-slate-200">
        <li>The axis animations are not as good as the animations of the D3 axis function.</li>
        <li>
          The XYChart lacks easy extensibility. Some code that would be useful in creating custom components
          is locked away in the library.
        </li>
        <li>
          The positioning of the tooltip can go wrong. (Reliably positioning floating UI elements is a
          difficult problem.)
        </li>
        <li>
          The library continues with the typical D3 approach to chart margins of requiring a hard-coded
          margin, rather than the margin being automatically calculated.
        </li>
        <li>
          There is an intermediate state apparent when changing prop values on the chart where old data is
          displayed using new props. This is because the data registration mechanism runs via `useEffect`.
        </li>
        <li>
          Event handling lacks flexibility on what events you can listen for and how the components react.
        </li>
      </ul>
      <SectionHeading>Bar Chart</SectionHeading>
      <BarChartExample />
    </main>
  );
}

export default VisxPage;
