import { FC } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';

import { D3BandAxisChart } from './D3BandAxisChart';
import { ReactBandAxisChart } from './ReactBandAxisChart';

const dataSets = [
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'C', 'D', 'E'],
  ['B', 'C', 'E']
];

export type BandAxisExamplesProps = {
  transitionSeconds?: number;
};

export const BandAxisExamples: FC<BandAxisExamplesProps> = ({ transitionSeconds = 0.25 }) => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Band Axis" subtitle="React" sizerClassName="h-28">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactBandAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              transitionSeconds={transitionSeconds}
              labelOrientation="horizontal"
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleChartWrapper title="Band Axis" subtitle="D3" sizerClassName="h-28">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <D3BandAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
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
