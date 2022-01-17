import { FC } from 'react';
import { SpringConfig } from '@react-spring/web';

import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';

import { AxisExampleChartWrapper } from './AxisExampleChartWrapper';
import { AxisExamplesWrapper } from './AxisExamplesWrapper';
import { D3LinearAxisChart } from './D3LinearAxisChart';
import { ReactLinearAxisChart } from './ReactLinearAxisChart';

const dataSets = [
  [-34, 5, -45, 30, 0, 17, -7, 19, -14, -8],
  [42, 183, 200, 102, 134, 38, 79, 10, 193, 107],
  [-160, -13, -3, -99]
];

export type LinearAxisExamplesProps = {
  transitionSeconds: number;
  springConfig: SpringConfig;
};

export const LinearAxisExamples: FC<LinearAxisExamplesProps> = ({ transitionSeconds, springConfig }) => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <AxisExamplesWrapper>
      <AxisExampleChartWrapper title="Rendered using React" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactLinearAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              springConfig={springConfig}
              tickLabelOrientation="horizontal"
            />
          )
        }
      </AxisExampleChartWrapper>
      <AxisExampleChartWrapper title="Rendered using D3" sizerClassName="h-[112px]">
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
