import { PageHeading } from '@/components/PageHeading';

import { RadarChartExamples } from './RadarChartExamples';

const RadarChart = () => (
  <>
    <PageHeading>Radar Chart</PageHeading>
    <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <RadarChartExamples transitionSeconds={0.5} />
    </div>
  </>
);

export default RadarChart;
