import { FC, useState } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { ReactCustomTimeAxisChart } from '@/pages/CustomAxis/ReactCustomTimeAxisChart';

const dataSets = [
  [new Date(Date.UTC(2000, 0, 1)), new Date(Date.UTC(2000, 9, 1))],
  [new Date(Date.UTC(1999, 8, 1)), new Date(Date.UTC(2000, 4, 1))],
  [new Date(Date.UTC(1999, 10, 1)), new Date(Date.UTC(2001, 1, 1))]
];

export type CustomTimeAxisExamplesProps = {
  transitionSeconds: number;
};

export const CustomTimeAxisExamples: FC<CustomTimeAxisExamplesProps> = ({ transitionSeconds }) => {
  const [dataIndex, setDataIndex] = useState(0);
  const cycleDataIndex = () => setDataIndex((i) => (i === dataSets.length - 1 ? 0 : i + 1));
  const data = dataSets[dataIndex];
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Custom Time Axis" subtitle="React">
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
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={cycleDataIndex}>Update axis data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};
