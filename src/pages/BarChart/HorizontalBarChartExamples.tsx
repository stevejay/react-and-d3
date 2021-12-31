import { FC } from 'react';

import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { Margins } from '@/types';
import { useDataSets } from '@/useDataSets';

import { HorizontalBarChart } from './HorizontalBarChart';
import { TemporaryChartWrapper } from './TemporaryChartWrapper';

const dataSets = [
  [
    { category: 'A', value: 89.34 },
    { category: 'B', value: 83.56 },
    { category: 'C', value: 81.32 },
    { category: 'D', value: 102.974 },
    { category: 'E', value: 87.247 }
  ],
  [
    { category: 'B', value: 150 },
    { category: 'C', value: 20 },
    { category: 'D', value: 63.9 }
  ],
  [
    { category: 'A', value: 0 },
    { category: 'B', value: 10 },
    { category: 'D', value: 63 },
    { category: 'E', value: 24 }
  ]
];

const margins: Margins = { left: 64, right: 40, top: 40, bottom: 64 };

export type HorizontalBarChartExamplesProps = {
  transitionSeconds: number;
};

export const HorizontalBarChartExamples: FC<HorizontalBarChartExamplesProps> = ({ transitionSeconds }) => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <ExamplesSectionWrapper>
      <TemporaryChartWrapper title="Horizontal Bar Chart">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <HorizontalBarChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              margins={margins}
            />
          )
        }
      </TemporaryChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};
