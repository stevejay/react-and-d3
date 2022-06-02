import { easeCubicInOut } from 'd3-ease';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { D3ScatterplotExample } from './D3ScatterplotExample';
import { ScatterplotExample } from './ScatterplotExample';

const springConfig = { duration: 500, easing: easeCubicInOut };

const Scatterplot = () => (
  <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Scatterplot</PageHeading>
    <SectionHeading>Zoomable Scatterplot</SectionHeading>
    <Paragraph>
      Some charts require that the user be able to zoom in and out of the chart area, and move around the
      chart. This is perfectly possible in React but the problem becomes performance. Below is a React
      scatterplot with zooming. Ideally the scaling and moving would be implemented using CSS transforms and
      so would be GPU-accelerated. This is important as the chart needs to be updated as the user interacts
      with it. Unfortunately the axes also need to be updated, so the chart as a whole has to redrawn. This is
      expensive when done via React, and you will likely notice performance issues on mobile.
    </Paragraph>
    <ScatterplotExample springConfig={springConfig} />
    <Paragraph>
      As a comparison, the equivalent D3-rendered chart is below. The DOM is directly updated and so the
      result is much more performant, even on mobile.
    </Paragraph>
    <D3ScatterplotExample />
  </main>
);

export default Scatterplot;
