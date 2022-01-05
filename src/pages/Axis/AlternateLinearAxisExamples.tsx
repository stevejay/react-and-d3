import { FC } from 'react';

import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';

import { AxisExampleChartWrapper } from './AxisExampleChartWrapper';
import { AxisExamplesWrapper } from './AxisExamplesWrapper';
import { D3LinearAxisChart } from './D3LinearAxisChart';
import { ReactLinearAxisNoExitChart } from './ReactLinearAxisNoExitChart';

const dataSets = [
  [-34, 5, -45, 30, 0, 17, -7, 19, -14, -8],
  [42, 183, 200, 102, 134, 38, 79, 10, 193, 107],
  [-200, -13, -3, -99]
];

export type AlternateLinearAxisExamplesProps = {
  transitionSeconds?: number;
};

export const AlternateLinearAxisExamples: FC<AlternateLinearAxisExamplesProps> = ({
  transitionSeconds = 0.25
}) => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <AxisExamplesWrapper>
      <AxisExampleChartWrapper title="React-rendered" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactLinearAxisNoExitChart
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
      <AxisExampleChartWrapper title="D3-rendered" sizerClassName="h-[112px]">
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
      </AxisExampleChartWrapper>
      <ExampleUpdateButton variant="secondary" onClick={nextDataSet}>
        Update axis data
      </ExampleUpdateButton>
    </AxisExamplesWrapper>
  );
};
