import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { RadarChartWithTooltipExample } from './RadarChartWithTooltipExample';

function RadarChart() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Radar Chart</PageHeading>
      <Helmet>
        <title>Radar Chart - React and D3</title>
      </Helmet>
      <SectionHeading>Selectable Radar Chart</SectionHeading>
      <Paragraph>
        This example acts as both a radar chart and a way to select a category for filtering other charts that
        might be displayed alongside it.
      </Paragraph>
      <RadarChartWithTooltipExample />
    </main>
  );
}

export default RadarChart;
