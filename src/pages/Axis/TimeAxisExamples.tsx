import { FC } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';

import { D3TimeAxisChart } from './D3TimeAxisChart';
import { ReactTimeAxisChart } from './ReactTimeAxisChart';

const dataSets = [
  [new Date(Date.UTC(2000, 0, 1)), new Date(Date.UTC(2000, 9, 1))],
  [new Date(Date.UTC(1999, 8, 1)), new Date(Date.UTC(2000, 4, 1))],
  [new Date(Date.UTC(1999, 10, 1)), new Date(Date.UTC(2001, 1, 1))]
];

export type TimeAxisExamplesProps = {
  transitionSeconds?: number;
};

export const TimeAxisExamples: FC<TimeAxisExamplesProps> = ({ transitionSeconds = 0.25 }) => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Time Axis" subtitle="React" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactTimeAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              transitionSeconds={transitionSeconds}
              tickLabelOrientation="angled"
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleChartWrapper title="Time Axis" subtitle="D3" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <D3TimeAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              transitionSeconds={transitionSeconds}
              tickLabelOrientation="horizontal"
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update time axis data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};
