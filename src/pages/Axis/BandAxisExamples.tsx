import { FC, useState } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';

import { D3BandAxisChart } from './D3BandAxisChart';
import { ReactBandAxisChart } from './ReactBandAxisChart';

const dataSets = [
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'C', 'D', 'E'],
  ['B', 'C', 'E']
];

export type BandAxisExamplesProps = {
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const BandAxisExamples: FC<BandAxisExamplesProps> = ({ drawTicksAsGridLines, transitionSeconds }) => {
  const [dataIndex, setDataIndex] = useState(0);
  const cycleDataIndex = () => setDataIndex((i) => (i === dataSets.length - 1 ? 0 : i + 1));
  const data = dataSets[dataIndex];
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Band Axis" subtitle="React">
        {({ inView, width, height }) =>
          inView && (
            <ReactBandAxisChart
              data={data}
              width={width}
              height={height}
              drawTicksAsGridLines={drawTicksAsGridLines}
              transitionSeconds={transitionSeconds}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleChartWrapper title="Band Axis" subtitle="D3">
        {({ inView, width, height }) =>
          inView && (
            <D3BandAxisChart
              data={data}
              width={width}
              height={height}
              drawTicksAsGridLines={drawTicksAsGridLines}
              transitionSeconds={transitionSeconds}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={cycleDataIndex}>Update band axis data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};
