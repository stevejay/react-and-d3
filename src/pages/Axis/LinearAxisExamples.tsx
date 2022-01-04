import { FC } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';

import { D3LinearAxisChart } from './D3LinearAxisChart';
import { ReactLinearAxisChart } from './ReactLinearAxisChart';

const dataSets = [
  [-34, 5, -45, 30, 0, 17, -7, 19, -14, -8],
  [42, 183, 200, 102, 134, 38, 79, 10, 193, 107],
  [-200, -13, -3, -99]
];

export type LinearAxisExamplesProps = {
  transitionSeconds?: number;
};

export const LinearAxisExamples: FC<LinearAxisExamplesProps> = ({ transitionSeconds = 0.25 }) => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Linear Axis" subtitle="React" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactLinearAxisChart
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
      <ExampleChartWrapper title="Linear Axis" subtitle="D3" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <D3LinearAxisChart
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
      <ExampleUpdateButton onClick={nextDataSet}>Update linear axis data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};
