import { FC, useState } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';

import { D3LinearAxisChart } from './D3LinearAxisChart';
import { ReactLinearAxisChart } from './ReactLinearAxisChart';

const dataSets = [
  [-34, 5, -45, 30, 0, 17, -7, 19, -14, -8],
  [42, 183, 200, 102, 134, 38, 79, 10, 193, 107],
  [-200, -13, -3, -99]
];

export type LinearAxisExamplesProps = {
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const LinearAxisExamples: FC<LinearAxisExamplesProps> = ({
  drawTicksAsGridLines,
  transitionSeconds
}) => {
  const [dataIndex, setDataIndex] = useState(0);
  const cycleDataIndex = () => setDataIndex((i) => (i === dataSets.length - 1 ? 0 : i + 1));
  const data = dataSets[dataIndex];
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Linear Axis" subtitle="React">
        {({ inView, width, height }) =>
          inView && (
            <ReactLinearAxisChart
              data={data}
              width={width}
              height={height}
              drawTicksAsGridLines={drawTicksAsGridLines}
              transitionSeconds={transitionSeconds}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleChartWrapper title="Linear Axis" subtitle="D3">
        {({ inView, width, height }) =>
          inView && (
            <D3LinearAxisChart
              data={data}
              width={width}
              height={height}
              drawTicksAsGridLines={drawTicksAsGridLines}
              transitionSeconds={transitionSeconds}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={cycleDataIndex}>Update linear axis data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};
