import { FC, useState } from 'react';
import { random, range } from 'lodash-es';

import { ChartTitle } from './ChartTitle';
import { D3LinearAxisChart } from './D3LinearAxisChart';
import { ReactLinearAxisChart } from './ReactLinearAxisChart';
import { ReactLinearAxisNoExitChart } from './ReactLinearAxisNoExitChart';
import { useDebouncedMeasure } from './useDebouncedMeasure';

function createRandomData(): number[] {
  const rangeSeed = random(0, 3);
  let dataRange: [number, number] = [10, 200];
  if (rangeSeed === 1) {
    dataRange = [-300, -5];
  } else if (rangeSeed === 2) {
    dataRange = [-50, 50];
  }
  return range(5, 15).map(() => random(...dataRange));
}

const dataA = [-34, 5, -45, 30, 0, 17, -7, 19, -14, -8];
const dataB = [42, 183, 200, 102, 134, 38, 79, 10, 193, 107];

const dataInterruptOne = [-48, 44];
const dataInterruptTwo = [-220, -102];
const dataInterruptThree = [39, 191];

export type LinearAxisExamplesProps = {
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const LinearAxisExamples: FC<LinearAxisExamplesProps> = ({
  drawTicksAsGridLines,
  transitionSeconds
}) => {
  const [data, setData] = useState(createRandomData);
  const { ref: sizerRef, width, height } = useDebouncedMeasure();

  return (
    <div className="space-y-4">
      <ChartTitle title="React Rendering" subtitle="Basic Exit Animation" />
      <div ref={sizerRef} className="h-28 w-full">
        <ReactLinearAxisChart
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div>
      <ChartTitle title="React Rendering" subtitle="Interruptible Exit Animation" />
      <div className="h-28 w-full">
        <ReactLinearAxisNoExitChart
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div>
      <ChartTitle title="D3 Rendering" />
      <div className="h-28 w-full">
        <D3LinearAxisChart
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setData(createRandomData)}
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Random data
        </button>
        <button
          type="button"
          onClick={() => setData((state) => (state === dataA ? dataB : dataA))}
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Data A/B
        </button>
        <button
          type="button"
          onClick={() =>
            setData((state) =>
              state === dataInterruptOne
                ? dataInterruptTwo
                : state == dataInterruptTwo
                ? dataInterruptThree
                : dataInterruptOne
            )
          }
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Interrupt 1 (200) / 2 (50, in) / 3
        </button>
      </div>
    </div>
  );
};
