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
      <div ref={sizerRef} className="w-full h-28">
        <ReactLinearAxisChart
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div>
      <ChartTitle title="React Rendering" subtitle="Interruptible Exit Animation" />
      <div className="w-full h-28">
        <ReactLinearAxisNoExitChart
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div>
      <ChartTitle title="D3 Rendering" />
      <div className="w-full h-28">
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
          className="px-4 py-2 font-light text-white outline-none bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring"
        >
          Random data
        </button>
        <button
          type="button"
          onClick={() => setData((state) => (state === dataA ? dataB : dataA))}
          className="px-4 py-2 font-light text-white outline-none bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring"
        >
          Data A/B
        </button>
        <button
          type="button"
          onClick={() => setData(dataInterruptOne)}
          className="px-4 py-2 font-light text-white outline-none bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring"
        >
          Interrupt 1
        </button>
        <button
          type="button"
          onClick={() => setData(dataInterruptTwo)}
          className="px-4 py-2 font-light text-white outline-none bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring"
        >
          Interrupt 2
        </button>
        <button
          type="button"
          onClick={() => setData(dataInterruptThree)}
          className="px-4 py-2 font-light text-white outline-none bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring"
        >
          Interrupt 3
        </button>
      </div>
    </div>
  );
};
