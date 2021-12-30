import { FC } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/useDataSets';

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
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Band Axis" subtitle="React">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactBandAxisChart
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
      <ExampleChartWrapper title="Band Axis" subtitle="D3">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <D3BandAxisChart
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
      <ExampleUpdateButton onClick={nextDataSet}>Update band axis data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};
