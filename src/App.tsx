import { FC, useState } from 'react';
import { random, range } from 'lodash-es';

import { AxisD3 } from './AxisD3';
import { SvgChart } from './SvgChart';

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

const transitionDurationSeconds = 3;

export const App: FC = () => {
  const [dimensions, setDimensions] = useState({ width: 600, height: 100 });
  const [data, setData] = useState(createRandomData);
  const [drawTicksAsGridLines, setDrawTicksAsGridLines] = useState(false);

  return (
    <div className="m-8 space-y-4">
      <SvgChart
        data={data}
        width={dimensions.width}
        height={dimensions.height}
        drawTicksAsGridLines={drawTicksAsGridLines}
        transitionDurationSeconds={transitionDurationSeconds}
      />
      <AxisD3
        data={data}
        width={dimensions.width}
        height={dimensions.height}
        drawTicksAsGridLines={drawTicksAsGridLines}
        transitionDurationSeconds={transitionDurationSeconds}
      />
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
          onClick={() =>
            setDimensions((state) =>
              state.width === 600 ? { width: 500, height: 200 } : { width: 600, height: 100 }
            )
          }
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Cycle dimensions
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
