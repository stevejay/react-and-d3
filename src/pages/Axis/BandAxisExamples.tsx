import { FC } from 'react';

import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';

import { AxisExampleChartWrapper } from './AxisExampleChartWrapper';
import { AxisExamplesWrapper } from './AxisExamplesWrapper';
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
    <AxisExamplesWrapper>
      <AxisExampleChartWrapper title="Rendered using React" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactBandAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              transitionSeconds={transitionSeconds}
              tickLabelOrientation="horizontal"
            />
          )
        }
      </AxisExampleChartWrapper>
      <AxisExampleChartWrapper title="Rendered using D3" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <D3BandAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              transitionSeconds={transitionSeconds}
              tickLabelOrientation="horizontal"
            />
          )
        }
      </AxisExampleChartWrapper>
      <ExampleUpdateButton variant="secondary" onClick={nextDataSet}>
        Update axis data
      </ExampleUpdateButton>
    </AxisExamplesWrapper>
  );
};
