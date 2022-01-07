import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { RadarChartWithTooltipExample } from './RadarChartWithTooltipExample';

const RadarChart = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Radar Chart</PageHeading>
    <SectionHeading>Selectable Radar Chart</SectionHeading>
    <Paragraph>
      This example acts as both a radar chart and a way to select a category for filtering other charts that
      might be displayed alongside it.
    </Paragraph>
    <RadarChartWithTooltipExample />
  </div>
);

export default RadarChart;
