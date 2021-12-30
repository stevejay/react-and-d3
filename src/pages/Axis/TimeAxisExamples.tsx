import { FC } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';

import { D3TimeAxisChart } from './D3TimeAxisChart';
import { ReactTimeAxisChart } from './ReactTimeAxisChart';
import { useDataSets } from './useDataSets';

const dataSets = [
  [new Date(Date.UTC(2000, 0, 1)), new Date(Date.UTC(2000, 9, 1))],
  [new Date(Date.UTC(1999, 8, 1)), new Date(Date.UTC(2000, 4, 1))],
  [new Date(Date.UTC(1999, 10, 1)), new Date(Date.UTC(2001, 1, 1))]
];

export type TimeAxisExamplesProps = {
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const TimeAxisExamples: FC<TimeAxisExamplesProps> = ({ drawTicksAsGridLines, transitionSeconds }) => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Time Axis" subtitle="React">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactTimeAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              drawTicksAsGridLines={drawTicksAsGridLines}
              transitionSeconds={transitionSeconds}
              labelOrientation="horizontal"
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleChartWrapper title="Time Axis" subtitle="D3">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <D3TimeAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              drawTicksAsGridLines={drawTicksAsGridLines}
              transitionSeconds={transitionSeconds}
              labelOrientation="horizontal"
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update time axis data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};
