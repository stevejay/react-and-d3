import { FC, useState } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';

import { D3TimeAxisChart } from './D3TimeAxisChart';
import { ReactTimeAxisChart } from './ReactTimeAxisChart';

const dataSets = [
  [new Date(Date.UTC(2000, 0, 1)), new Date(Date.UTC(2000, 9, 1))],
  [new Date(Date.UTC(1999, 8, 1)), new Date(Date.UTC(2000, 4, 1))],
  [new Date(Date.UTC(1999, 10, 1)), new Date(Date.UTC(2001, 1, 1))]
];

export type TimeAxisExamplesProps = {
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const TimeAxisExamples: FC<TimeAxisExamplesProps> = ({ drawTicksAsGridLines, transitionSeconds }) => {
  const [dataIndex, setDataIndex] = useState(0);
  const cycleDataIndex = () => setDataIndex((i) => (i === dataSets.length - 1 ? 0 : i + 1));
  const data = dataSets[dataIndex];
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Time Axis" subtitle="React">
        {({ inView, width, height }) =>
          inView && (
            <ReactTimeAxisChart
              data={data}
              width={width}
              height={height}
              drawTicksAsGridLines={drawTicksAsGridLines}
              transitionSeconds={transitionSeconds}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleChartWrapper title="Time Axis" subtitle="D3">
        {({ inView, width, height }) =>
          inView && (
            <D3TimeAxisChart
              data={data}
              width={width}
              height={height}
              drawTicksAsGridLines={drawTicksAsGridLines}
              transitionSeconds={transitionSeconds}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={cycleDataIndex}>Update time axis data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};

/* <ChartTitle title="React Rendering" subtitle="Interruptible Exit Animation" />
      <div className="w-full h-28">
        <ReactTimeAxisNoExitChart
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div> */
