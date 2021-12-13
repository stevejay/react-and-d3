import { FC, useState } from 'react';
import { random, range } from 'lodash-es';

import { D3AxisChart } from './D3AxisChart';
import { ReactAxisChart } from './ReactAxisChart';
import { useDebouncedResizeObserver } from './useDebouncedResizeObserver';

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

const dataOne = [-34, 5, -45, 30, 0, 17, -7, 19, -14, -8];
const dataTwo = [42, 183, 200, 102, 134, 38, 79, 10, 193, 107];

const dataInterruptOne = [-48, 44];
const dataInterruptTwo = [-220, -102];
const dataInterruptThree = [39, 191];

export const App: FC = () => {
  const [transitionSeconds, setTransitionSeconds] = useState(0.25);
  const [data, setData] = useState(createRandomData);
  const [drawTicksAsGridLines, setDrawTicksAsGridLines] = useState(false);
  const { ref: sizerRef, width, height } = useDebouncedResizeObserver(300);

  return (
    <div className="m-8 space-y-4">
      <div ref={sizerRef} className="h-36 w-full">
        <ReactAxisChart
          // Seems to be the only way to get the MotionConfig transition prop to accept
          // an update to the duration value:
          key={transitionSeconds}
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div>
      <div className="h-36 w-full">
        <D3AxisChart
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
          New data
        </button>
        <button
          type="button"
          onClick={() => setData((state) => (state === dataOne ? dataTwo : dataOne))}
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Data 1 / 2
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
          Interrupt 1 / 2 / 3
        </button>
        <button
          type="button"
          onClick={() => setTransitionSeconds((state) => (state === 0.25 ? 3 : 0.25))}
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Cycle speed
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="ticks-as-grid-lines"
          type="checkbox"
          checked={drawTicksAsGridLines}
          onChange={() => setDrawTicksAsGridLines((state) => !state)}
        />
        <label htmlFor="ticks-as-grid-lines">Draw inner ticks as grid lines</label>
      </div>
    </div>
  );
};
