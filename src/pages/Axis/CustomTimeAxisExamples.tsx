import { FC, useState } from 'react';

import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';

import { AxisExampleChartWrapper } from './AxisExampleChartWrapper';
import { AxisExamplesWrapper } from './AxisExamplesWrapper';
import { ReactCustomTimeAxisChart } from './ReactCustomTimeAxisChart';

const dataSets = [
  [new Date(Date.UTC(2000, 0, 1)), new Date(Date.UTC(2000, 9, 1))],
  [new Date(Date.UTC(1999, 8, 1)), new Date(Date.UTC(2000, 4, 1))],
  [new Date(Date.UTC(1999, 10, 1)), new Date(Date.UTC(2000, 6, 1))]
];

export type CustomTimeAxisExamplesProps = {
  transitionSeconds?: number;
};

export const CustomTimeAxisExamples: FC<CustomTimeAxisExamplesProps> = ({ transitionSeconds = 0.25 }) => {
  const [dataIndex, setDataIndex] = useState(0);
  const cycleDataIndex = () => setDataIndex((i) => (i === dataSets.length - 1 ? 0 : i + 1));
  const data = dataSets[dataIndex];
  return (
    <AxisExamplesWrapper>
      <AxisExampleChartWrapper title="React-rendered" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactCustomTimeAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width ?? 0}
              height={height ?? 0}
              transitionSeconds={transitionSeconds}
            />
          )
        }
      </AxisExampleChartWrapper>
      <ExampleUpdateButton variant="secondary" onClick={cycleDataIndex}>
        Update axis data
      </ExampleUpdateButton>
    </AxisExamplesWrapper>
  );
};
