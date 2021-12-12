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

// const dataOne = [30, 40, 50, 60];
// const dataTwo = [10, 20, 30, 40, 50, 60, 70, 80];

export const App: FC = () => {
  const [dimensions, setDimensions] = useState({ width: 600, height: 100 });
  const [data, setData] = useState(createRandomData);
  //   const [data, setData] = useState(dataOne);
  const [drawTicksAsGridLines, setDrawTicksAsGridLines] = useState(false);
  return (
    <div className="m-8 space-y-4">
      <SvgChart
        data={data}
        width={dimensions.width}
        height={dimensions.height}
        drawTicksAsGridLines={drawTicksAsGridLines}
        transitionDurationSeconds={1}
      />
      <AxisD3
        data={data}
        width={dimensions.width}
        height={dimensions.height}
        drawTicksAsGridLines={drawTicksAsGridLines}
      />
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setData(createRandomData)}
          //   onClick={() => setData((state) => (state === dataOne ? dataTwo : dataOne))}
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          New data
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
